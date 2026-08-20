import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/StatCard";
import { Flame, Calendar, MapPin, Plus, UserCheck, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { PermissionGate } from "@/components/common/PermissionGate";

export default function ChaturmasPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const orgId = user?.organizationIds?.[0];

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  
  const [monks, setMonks] = useState([]);
  const [temples, setTemples] = useState([]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    monkId: "none", monkName: "", locationName: "", startDate: "", endDate: "", contactPerson: "", contactMobile: "", status: "ACTIVE", notes: ""
  });

  const loadData = async () => {
    const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.primaryRoleKey === 'SUPER_ADMIN' || user?.isSuperAdmin;
    if (!orgId && !isSuperAdmin) return;
    setLoading(true);
    try {
      const chaturmasEndpoint = orgId ? `/chaturmas/org/${orgId}` : `/chaturmas`;
      const [chaturmasRes, monksRes, tRes, sRes, jRes] = await Promise.all([
        api.get(chaturmasEndpoint).catch((err) => { toast.error("chaturmas error: " + err.message); return { data: { data: [] } }; }),
        api.get(`/monks`).catch((err) => { toast.error("monks error: " + err.message); return { data: { data: [] } }; }),
        api.get(`/temples`).catch((err) => { toast.error("temples error: " + err.message); return { data: { data: [] } }; }),
        api.get(`/sthanaks`).catch((err) => { toast.error("sthanaks error: " + err.message); return { data: { data: [] } }; }),
        api.get(`/jain-centers`).catch((err) => { toast.error("jain-centers error: " + err.message); return { data: { data: [] } }; })
      ]);
      setRows(chaturmasRes.data?.data?.items || chaturmasRes.data?.data || []);
      const fetchedMonks = monksRes.data?.data?.items || monksRes.data?.data || [];
      setMonks(fetchedMonks);
      console.log("Fetched monks:", fetchedMonks);
      const allOrgs = [
        ...(tRes.data?.data?.items || tRes.data?.data || []),
        ...(sRes.data?.data?.items || sRes.data?.data || []),
        ...(jRes.data?.data?.items || jRes.data?.data || [])
      ];
      setTemples(allOrgs);
    } catch (e) {
      toast.error(t("Failed to load Chaturmas stays and monks."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      monkId: "", monkName: "", locationName: "", startDate: "", endDate: "", contactPerson: "", contactMobile: "", status: "ACTIVE", notes: ""
    });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      monkId: row.monkId || "",
      monkName: row.monkName,
      locationName: row.locationName,
      startDate: row.startDate ? row.startDate.slice(0, 10) : "",
      endDate: row.endDate ? row.endDate.slice(0, 10) : "",
      contactPerson: row.contactPerson || "",
      contactMobile: row.contactMobile || "",
      status: row.status || "ACTIVE",
      notes: row.notes || ""
    });
    setOpen(true);
  };

  const handleSave = async () => {
    let finalMonkName = form.monkName;
    if (form.monkId) {
      const selectedMonk = monks.find(m => m.id === form.monkId);
      if (selectedMonk) {
        finalMonkName = selectedMonk.dikshaName;
      }
    }

    let finalOrgId = orgId;
    const finalLocationName = form.locationName;

    if (form.locationName) {
      const selectedTemple = temples.find(t => t.name === form.locationName);
      if (selectedTemple) {
        finalOrgId = selectedTemple.id;
      }
    }

    if (!finalMonkName || !finalLocationName || !form.startDate || !form.monkId) {
      toast.error(t("Please fill in monk name, location and start date."));
      return;
    }

    if (!finalOrgId) {
      toast.error(t("Please select a Temple from the list to link this Chaturmas entry."));
      return;
    }

    const payload = {
      organizationId: finalOrgId,
      monkId: form.monkId,
      monkName: finalMonkName,
      locationName: finalLocationName,
      startDate: form.startDate,
      endDate: form.endDate || null,
      contactPerson: form.contactPerson || null,
      contactMobile: form.contactMobile || null,
      status: form.status,
      notes: form.notes || null
    };

    setSaving(true);
    try {
      if (editing) {
        await api.patch(`/chaturmas/${editing.id}`, payload);
        toast.success(t("Chaturmas listing updated successfully!"));
      } else {
        await api.post("/chaturmas", payload);
        toast.success(t("Chaturmas listing added successfully!"));
      }
      setOpen(false);
      loadData();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to save Chaturmas stay.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!confirm(`Delete Chaturmas stay for: ${row.monkName}?`)) return;
    try {
      await api.delete(`/chaturmas/${row.id}`);
      toast.success(t("Chaturmas listing deleted."));
      loadData();
    } catch (e) {
      toast.error(t("Failed to delete Chaturmas listing."));
    }
  };

  const columns = [
    { key: "monkName", header: t("Monk / Sadhvi"), render: (r) => <span className="font-semibold text-slate-800">{r.monkName}</span> },
    { key: "locationName", header: t("Location & Centre"), render: (r) => <span className="text-slate-600 flex items-center gap-1"><MapPin className="h-3 w-3 text-orange-500" />{r.locationName}</span> },
    { key: "dates", header: t("Period"), render: (r) => <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="h-3 w-3" />{r.startDate ? r.startDate.slice(0, 10) : "—"} to {r.endDate ? r.endDate.slice(0, 10) : "—"}</span> },
    { key: "contact", header: t("Contact Person"), render: (r) => <span className="text-slate-600 font-medium">{r.contactPerson || "—"}</span> },
    { key: "status", header: t("Status"), render: (r) => <Badge className={r.status === "ACTIVE" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-slate-400 text-white"}>{r.status}</Badge> },
    {
      key: "actions", header: "", render: (r) => (
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
          <PermissionGate action="DELETE">
            <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(r)}><Trash2 className="h-4 w-4" /></Button>
          </PermissionGate>
        </div>
      )
    }
  ];

  const stayCentersCount = Array.from(new Set(rows.map(r => r.locationName))).length;

  return (
    <div data-testid="chaturmas-page">
      <PageHeader
        title={t("Chaturmas Management")}
        subtitle={t("Manage seasonal Chaturmas stays, monk locations, lecture schedules, and local host coordination.")}
        actions={
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" /> {t("Add Chaturmas Stay")}</Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <StatCard label={t("Active Chaturmas")} value={rows.filter(r => r.status === "ACTIVE").length} icon={Flame} tone="warning" />
        <StatCard label={t("Total Stays")} value={rows.length} icon={UserCheck} tone="default" />
        <StatCard label={t("Stay Centers")} value={stayCentersCount} icon={MapPin} tone="info" />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        testId="chaturmas-table"
        emptyTitle={t("No Chaturmas stay listings")}
        emptyDescription={t("Add Chaturmas stay records to begin tracking monk rainy season stays.")}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? t("Edit Chaturmas Stay") : t("Add Chaturmas Stay")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div>
              <Label className="text-xs">{t("Select Monk / Sadhvi *")}</Label>
              <Select
                value={form.monkId || ""}
                onValueChange={(val) => setForm({ ...form, monkId: val, monkName: monks.find(m => m.id === val)?.dikshaName || "" })}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder={t("Select a monk")} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {monks.length === 0 ? (
                    <SelectItem value="none" disabled>No monks found</SelectItem>
                  ) : (
                    monks.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.dikshaName} {m.publicId ? `(${m.publicId})` : ''}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">{t("Chaturmas Location / Temple *")}</Label>
              <Select
                value={form.locationName || ""}
                onValueChange={(val) => setForm({ ...form, locationName: val })}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder={t("Select a location")} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {temples.length === 0 ? (
                    <SelectItem value="none" disabled>No locations found</SelectItem>
                  ) : (
                    temples.map((t) => (
                      <SelectItem key={t.name} value={t.name}>
                        {t.name} {t.city ? `(${t.city})` : ''}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{t("Start Date *")}</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">{t("End Date")}</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{t("Contact Person")}</Label>
                <Input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} placeholder={t("Amit Shah")} />
              </div>
              <div>
                <Label className="text-xs">{t("Contact Mobile")}</Label>
                <Input value={form.contactMobile} onChange={(e) => setForm({ ...form, contactMobile: e.target.value })} placeholder={t("+91XXXXXXXXXX")} />
              </div>
            </div>
            {editing && (
              <div>
                <Label className="text-xs">{t("Status")}</Label>
                <Select
                  value={form.status}
                  onValueChange={(val) => setForm({ ...form, status: val })}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder={t("Select status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>{t("Cancel")}</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? t("Saving...") : editing ? t("Update Stays") : t("Save Stays")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
