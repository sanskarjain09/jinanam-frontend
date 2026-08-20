import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, MapPin, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RoutesPage() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [monks, setMonks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [rows, setRows] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", monkId: "", monkGroupId: "", journeyDate: "", stops: [] });

  const loadRoutesAndMonks = async () => {
    setLoading(true);
    try {
      const [routesRes, monksRes, groupsRes, templesRes, jainCentersRes, dharamshalasRes] = await Promise.all([
        api.get("/tracking/routes"),
        api.get("/monks"),
        api.get("/monks/groups").catch(() => ({ data: { data: [] } })),
        api.get("/temples").catch(() => ({ data: { data: [] } })),
        api.get("/jain-centers").catch(() => ({ data: { data: [] } })),
        api.get("/dharamshalas").catch(() => ({ data: { data: [] } }))
      ]);
      setRows(routesRes.data?.data || []);
      setMonks(monksRes.data?.data || []);
      setGroups(groupsRes.data?.data || []);

      const allOrgs = [
        ...(templesRes.data?.data || []),
        ...(jainCentersRes.data?.data || []),
        ...(dharamshalasRes.data?.data || [])
      ].map(o => ({ value: o.id, label: `${o.name} (${o.publicId})`, city: o.city || "" }));
      setOrgs(allOrgs);
    } catch (e) {
      toast.error(t("Failed to load data."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutesAndMonks();
  }, []);

  const openAdd = () => {
    setForm({
      id: null,
      name: "",
      monkId: "",
      monkGroupId: "",
      journeyDate: "",
      stops: [
        { templeId: "", templeName: "", dateTime: "" },
        { templeId: "", templeName: "", dateTime: "" }
      ]
    });
    setOpen(true);
  };

  const openEdit = (r) => {
    setForm({
      id: r.id,
      name: r.name,
      monkId: r.monkId || "",
      monkGroupId: r.monkGroupId || "",
      journeyDate: r.journeyDate ? r.journeyDate.slice(0, 10) : "",
      stops: r.stops && r.stops.length > 0 ? r.stops.map(s => ({ templeId: s.templeId || "", templeName: s.templeName || "", dateTime: s.dateTime || "" })) : [
        { templeId: "", templeName: "", dateTime: "" },
        { templeId: "", templeName: "", dateTime: "" }
      ]
    });
    setOpen(true);
  };

  const saveRoute = async () => {
    if (!form.name || (!form.monkId && !form.monkGroupId) || !form.journeyDate) {
      toast.error(t("Please fill in Route Name, Target (at least one), and Vihar Start Date."));
      return;
    }
    const validStops = form.stops.filter(s => s.templeName.trim());
    if (validStops.length < 2) {
      toast.error(t("Please provide at least 2 stops."));
      return;
    }

    for (let i = 1; i < validStops.length; i++) {
      if (validStops[i].dateTime && validStops[i-1].dateTime) {
        if (new Date(validStops[i].dateTime) < new Date(validStops[i-1].dateTime)) {
          toast.error(t(`Stop ${i + 1} date/time cannot be before Stop ${i} date/time.`));
          return;
        }
      }
    }

    const payload = {
      name: form.name,
      monkId: form.monkId || undefined,
      monkGroupId: form.monkGroupId || undefined,
      journeyDate: new Date(form.journeyDate).toISOString(),
      stops: validStops.map((s, idx) => ({
        order: idx,
        templeName: s.templeName,
        templeId: s.templeId || undefined,
        dateTime: s.dateTime || undefined,
        status: "PENDING"
      }))
    };

    setSaving(true);
    try {
      if (form.id) {
        await api.patch(`/tracking/routes/${form.id}`, payload);
        toast.success(t("Vihar route updated successfully."));
      } else {
        await api.post("/tracking/routes", payload);
        toast.success(t("New Vihar route created successfully."));
      }
      setOpen(false);
      loadRoutesAndMonks();
    } catch (e) {
      toast.error(e?.response?.data?.message || t("Failed to save route."));
    } finally {
      setSaving(false);
    }
  };

  const updateStop = (index, field, val) => {
    const newStops = [...form.stops];
    newStops[index][field] = val;
    if (field === 'templeId') {
      const org = orgs.find(o => o.value === val);
      if (org) {
        newStops[index].templeName = org.city || org.label.split(' (')[0];
      }
    }
    setForm({ ...form, stops: newStops });
  };

  const addStop = () => {
    setForm({ ...form, stops: [...form.stops, { templeId: "", templeName: "", dateTime: "" }] });
  };

  const removeStop = (index) => {
    const newStops = [...form.stops];
    newStops.splice(index, 1);
    setForm({ ...form, stops: newStops });
  };

  const columns = [
    { key: "name", header: t("Route Name"), render: (r) => <span className="font-semibold text-slate-800">{r.name}</span> },
    { key: "target", header: t("Target"), render: (r) => <span className="text-slate-700 font-medium">{r.monk?.dikshaName || r.monkGroup?.name || "Unknown"}</span> },
    { key: "span", header: t("Route Span"), render: (r) => {
      const stops = r.stops || [];
      const start = stops[0]?.templeName || "Start";
      const end = stops[stops.length - 1]?.templeName || "End";
      return (
        <span className="text-sm text-slate-600 flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-orange-500" /> {start} to {end}
        </span>
      );
    }},
    { key: "journeyDate", header: t("Vihar Date"), render: (r) => <span className="text-sm font-mono">{r.journeyDate ? r.journeyDate.slice(0, 10) : "—"}</span> },
    { key: "stops", header: t("Defined Rest Stops"), render: (r) => <Badge className="bg-orange-500 text-white">{(r.stops || []).length} {t("Stops")}</Badge> },
    { key: "actions", header: "", align: "right", render: (r) => (
        <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Edit className="h-4 w-4 text-slate-500" /></Button>
    ) }
  ];

  return (
    <div data-testid="routes-page">
      <PageHeader
        title={t("Vihar Routes Master")}
        subtitle={t("Pre-define, configure and inspect standard Vihar highway transit pathways.")}
        actions={
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" /> {t("Add Route Definition")}</Button>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        testId="routes-table"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? t("Edit Vihar Route") : t("Add Vihar Route")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex flex-col md:flex-row gap-4 mb-2">
              <div className="flex-1">
                <Label className="text-xs">{t("Monk / Sadhvi (Optional)")}</Label>
                <SearchableSelect
                  value={form.monkId}
                  onValueChange={(val) => setForm({ ...form, monkId: val })}
                  options={monks.map((m) => ({ value: m.id, label: `${m.dikshaName} (${m.publicId})` }))}
                  placeholder={t("Select a monk")}
                  searchPlaceholder={t("Search monks…")}
                  className="mt-1"
                  disabled={!!form.id && !!form.monkId}
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs">{t("Sangh / Group (Optional)")}</Label>
                <SearchableSelect
                  value={form.monkGroupId}
                  onValueChange={(val) => setForm({ ...form, monkGroupId: val })}
                  options={groups.map((g) => ({ value: g.id, label: g.name }))}
                  placeholder={t("Select a group")}
                  searchPlaceholder={t("Search groups…")}
                  className="mt-1"
                  disabled={!!form.id && !!form.monkGroupId}
                />
              </div>
            </div>

            <div><Label className="text-xs">{t("Route Name *")}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("e.g. Mumbai-Pune Highway Route")} className="mt-1" /></div>
            
            <div className="border border-slate-200 rounded-md p-3 space-y-3 bg-slate-50/50">
              <Label className="text-sm font-semibold">{t("Route Stops")}</Label>
              <p className="text-xs text-slate-500">{t("Define the sequence of locations (A to B to C). Link to organizations for automatic feed updates.")}</p>
              
              {form.stops.map((stop, idx) => (
                <div key={idx} className="flex gap-2 items-start bg-white p-2 border border-slate-100 rounded shadow-sm">
                  <div className="flex-1 space-y-2">
                    <SearchableSelect
                      value={stop.templeId}
                      onValueChange={(val) => updateStop(idx, 'templeId', val)}
                      options={orgs}
                      placeholder={t("Link to Organization (Optional)")}
                      searchPlaceholder={t("Search temples/centers…")}
                    />
                    <Input 
                      value={stop.templeName} 
                      onChange={(e) => updateStop(idx, 'templeName', e.target.value)} 
                      placeholder={t("Location / Stop Name *")}
                    />
                    <Input 
                      type="datetime-local"
                      value={stop.dateTime || ""} 
                      onChange={(e) => updateStop(idx, 'dateTime', e.target.value)} 
                      min={idx > 0 && form.stops[idx-1].dateTime ? form.stops[idx-1].dateTime : undefined}
                      className="text-xs"
                    />
                  </div>
                  {form.stops.length > 2 && (
                    <Button variant="ghost" size="icon" onClick={() => removeStop(idx)} className="mt-1 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addStop} className="w-full border-dashed bg-white">
                <Plus className="h-4 w-4 mr-2" /> {t("Add Another Stop")}
              </Button>
            </div>

            <div><Label className="text-xs">{t("Vihar Date *")}</Label><Input type="date" value={form.journeyDate} onChange={(e) => setForm({ ...form, journeyDate: e.target.value })} className="mt-1" /></div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>{t("Cancel")}</Button>
            <Button onClick={saveRoute} disabled={saving}>{saving ? t("Saving...") : t("Save Route")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
