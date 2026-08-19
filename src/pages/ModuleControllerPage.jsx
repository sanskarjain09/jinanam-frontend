import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, extractErrorMessage } from "@/lib/api";
import { toast } from "sonner";
import { PLATFORM_MODULES } from "@/lib/access";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Save, Building2, UserPlus } from "lucide-react";
import { DelegateModuleModal } from "@/components/modals/DelegateModuleModal";

export default function ModuleControllerPage() {
  const { user, isSuperAdmin, canEdit } = useAuth();
  const { t } = useLanguage();
  
  const hasEditAccess = isSuperAdmin || ["TEMPLES", "DHARAMSHALAS", "JAIN_CENTERS", "STHANAKS", "BHOJANSHALAS", "COMMUNITY_PAGES"].some(m => canEdit(m));
  
  const [orgs, setOrgs] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [activeModules, setActiveModules] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [staffList, setStaffList] = useState([]);
  
  const [delegateModalOpen, setDelegateModalOpen] = useState(false);
  const [delegateModuleKey, setDelegateModuleKey] = useState(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      // Fetch all organizations user has access to
      const res = await api.get("/temples");
      let allOrgs = res.data?.data?.items || res.data?.data || [];
      
      if (!isSuperAdmin) {
        allOrgs = allOrgs.filter(org => user?.organizationIds?.includes(org._id) || user?.organizationIds?.includes(org.id));
      }
      
      setOrgs(allOrgs);
      if (allOrgs.length > 0) {
        setSelectedOrgId(allOrgs[0].id || allOrgs[0]._id);
        const initialModules = allOrgs[0].activeModules || [];
        setActiveModules(new Set(initialModules));
      }
    } catch (err) {
      toast.error(t("Failed to load organizations"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrgChange = (orgId) => {
    setSelectedOrgId(orgId);
    const org = orgs.find(o => (o.id === orgId || o._id === orgId));
    if (org) {
      setActiveModules(new Set(org.activeModules || []));
    }
  };

  const fetchOrgStaff = async (orgId) => {
    try {
      const res = await api.get(`/auth/admins/org/${orgId}`);
      setStaffList(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch staff list", err);
    }
  };

  useEffect(() => {
    if (selectedOrgId) {
      fetchOrgStaff(selectedOrgId);
    }
  }, [selectedOrgId]);

  const toggleModule = (moduleKey) => {
    setActiveModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleKey)) next.delete(moduleKey);
      else next.add(moduleKey);
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedOrgId) return;
    try {
      setSaving(true);
      const org = orgs.find(o => (o.id === selectedOrgId || o._id === selectedOrgId));
      
      // Determine the endpoint based on org type (all go to /temples effectively in backend but let's use the type if needed, 
      // wait, in the backend they are separate routers but all map to different prefixes? No, /temples, /dharamshalas, /jain-centers)
      // Actually backend /temples/:id works for ANY organization type if using makeOrganizationController, but it's cleaner to use the correct route if possible.
      // Wait, makeOrganizationController('TEMPLE') only fetches TEMPLE if we use GET, but PATCH /temples/:id might only update TEMPLES?
      // No, in organizations.service.ts updateOrganization takes orgId and doesn't enforce type.
      // Let's just use /temples/:id
      const endpoint = `/temples/${selectedOrgId}`;
      
      await api.patch(endpoint, {
        activeModules: Array.from(activeModules)
      });
      
      toast.success(t("Modules updated successfully"));
      
      // Update local state
      setOrgs(prev => prev.map(o => {
        if (o.id === selectedOrgId || o._id === selectedOrgId) {
          return { ...o, activeModules: Array.from(activeModules) };
        }
        return o;
      }));
      
      // Notify Sidebar to refresh
      window.dispatchEvent(new CustomEvent("jinanam_temples_mutated"));
    } catch (err) {
      toast.error(extractErrorMessage(err) || t("Failed to update modules"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><span className="text-sm text-slate-500">Loading...</span></div>;
  }

  const selectedOrg = orgs.find(o => (o.id === selectedOrgId || o._id === selectedOrgId));

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 relative">
      <div className="sticky top-16 md:top-20 z-20 bg-slate-50/90 backdrop-blur-md pb-4 pt-6 -mt-6 -mx-6 px-6 border-b border-slate-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t("Module Controller")}</h1>
            <p className="text-sm text-slate-500">{t("Enable or disable specific modules for your organization.")}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {orgs.length > 0 && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Building2 className="w-4 h-4 text-slate-400 hidden sm:block" />
              <Select value={selectedOrgId} onValueChange={handleOrgChange}>
                <SelectTrigger className="w-full sm:w-[250px] bg-white">
                  <SelectValue placeholder={t("Select...")} />
                </SelectTrigger>
                <SelectContent>
                  {orgs.map(org => (
                    <SelectItem key={org.id || org._id} value={org.id || org._id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={handleSave} disabled={saving || orgs.length === 0} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
            <Save className="w-4 h-4 mr-2" />
            {saving ? t("Saving...") : t("Save Configuration")}
          </Button>
        </div>
      </div>

      <Card className="p-6 border-slate-200 shadow-sm space-y-6">
        {orgs.length > 0 ? (
          <>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{t("Active Modules")}</h3>
                  <p className="text-sm text-slate-500">
                    {t("Selected modules will be visible in the sidebar for this organization's staff.")}
                  </p>
                </div>
              </div>
              
              {/* Note: Physical facilities validation is handled in Sidebar.jsx. Here we just let them toggle what they want. */}
              <div className="grid grid-cols-1 gap-4">
                {PLATFORM_MODULES.map((mod) => {
                  const moduleStaff = staffList.filter(s => s.modules && s.modules[mod.key]);
                  
                  return (
                    <div key={mod.key} className="flex flex-col p-4 rounded-md border border-slate-200 bg-white shadow-sm hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id={`mod-${mod.key}`}
                            checked={activeModules.has(mod.key)}
                            onCheckedChange={() => toggleModule(mod.key)}
                            className="mt-1"
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor={`mod-${mod.key}`}
                              className="text-base font-semibold text-slate-800 cursor-pointer"
                            >
                              {t(mod.label)}
                            </Label>
                            <p className="text-sm text-slate-500">
                              {t(mod.category)}
                            </p>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => {
                            setDelegateModuleKey(mod.key);
                            setDelegateModalOpen(true);
                          }}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          {t("Create Staff")}
                        </Button>
                      </div>

                      {/* Staff List for this Module */}
                      {moduleStaff.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 pl-8 space-y-2">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("Assigned Staff")}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {moduleStaff.map(staff => (
                              <div key={staff.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2 rounded-md">
                                <div>
                                  <p className="text-sm font-medium text-slate-700">
                                    {staff.firstName} {staff.lastName || ""}
                                  </p>
                                  <p className="text-xs text-slate-500">{staff.mobile}</p>
                                </div>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  staff.modules[mod.key] === "READ_WRITE" 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-amber-100 text-amber-700"
                                }`}>
                                  {staff.modules[mod.key] === "READ_WRITE" ? "Read & Write" : "Read Only"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-slate-500">
            {t("No organizations found. You must be assigned to an organization to manage its modules.")}
          </div>
        )}
      </Card>
      
      {delegateModalOpen && (
        <DelegateModuleModal 
          open={delegateModalOpen}
          onClose={() => setDelegateModalOpen(false)}
          moduleKey={delegateModuleKey}
          orgId={selectedOrgId}
          onSuccess={() => fetchOrgStaff(selectedOrgId)}
        />
      )}
    </div>
  );
}
