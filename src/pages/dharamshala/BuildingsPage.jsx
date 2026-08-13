import { useEffect, useState } from "react";
import { api, extractErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Building } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useOrgs } from "@/hooks/useOrgs";
import { OrgSelect } from "@/components/common/OrgSelect";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

export default function BuildingsPage() {
  const { t } = useLanguage();
  const { user, isSuperAdmin } = useAuth();
  const { orgs } = useOrgs();
  const [selectedOrg, setSelectedOrg] = useState("");

  const dharamshalas = orgs.filter((o) => o.type === "DHARAMSHALA");
  const orgId = user?.organizationIds?.[0] || selectedOrg || (isSuperAdmin ? dharamshalas[0]?.id : undefined);

  const [loading, setLoading] = useState(false);
  const [structure, setStructure] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBuildingName, setNewBuildingName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!orgId) return;
    loadStructure();
  }, [orgId]);

  const loadStructure = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/dharamshalas/${orgId}/structure`);
      setStructure(res.data?.data);
      setBuildings(res.data?.data?.buildings || []);
    } catch (e) {
      toast.error(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleAddBuilding = async () => {
    if (!newBuildingName.trim()) return;
    setSaving(true);
    try {
      await api.post(`/dharamshalas/${orgId}/buildings`, { name: newBuildingName.trim() });
      toast.success(t("Building added successfully!"));
      setIsAddModalOpen(false);
      setNewBuildingName("");
      loadStructure();
    } catch (e) {
      toast.error(extractErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title={t("Buildings Management")} 
          description={t("Manage buildings for your Dharamshala.")} 
        />
        {isSuperAdmin && (
          <OrgSelect
            value={selectedOrg || orgId}
            onChange={setSelectedOrg}
            options={dharamshalas}
            label={t("Select Dharamshala")}
            className="w-full md:w-64"
          />
        )}
      </div>

      {!orgId ? (
        <Card className="p-8 text-center text-muted-foreground">
          {t("Please select a Dharamshala to manage buildings.")}
        </Card>
      ) : loading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-700 hover:bg-purple-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              {t("Add Building")}
            </Button>
          </div>

          {buildings.length === 0 ? (
            <EmptyState 
              icon={Building}
              title={t("No Buildings Found")}
              description={t("Start by adding a new building to this Dharamshala.")}
              action={<Button onClick={() => setIsAddModalOpen(true)}>{t("Add Building")}</Button>}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buildings.map((b) => (
                <Card key={b.id} className="p-5 flex items-center justify-between border-l-4 border-l-purple-500 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-md">
                      <Building className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{b.name}</h3>
                      <p className="text-xs text-muted-foreground">{b.wings?.length || 0} Floors/Wings</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Add New Building")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Building Name")}</label>
              <Input 
                value={newBuildingName}
                onChange={(e) => setNewBuildingName(e.target.value)}
                placeholder={t("e.g. Main Block, Block A")}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>{t("Cancel")}</Button>
            <Button onClick={handleAddBuilding} disabled={!newBuildingName.trim() || saving} className="bg-purple-700 text-white">
              {saving ? t("Saving...") : t("Save Building")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
