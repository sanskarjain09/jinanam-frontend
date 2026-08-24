import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, MapPin, Trash2, Edit, Eye, Navigation, UserCircle, Users } from "lucide-react";
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
  const [members, setMembers] = useState([]);
  const [viewRoute, setViewRoute] = useState(null);
  const [form, setForm] = useState({ id: null, name: "", targetType: "MONK", monkId: "", monkGroupId: "", participantMonkIds: [], contactPersonIds: [], journeyDate: "", stops: [] });

  const loadRoutesAndMonks = async () => {
    setLoading(true);
    try {
      const [routesRes, monksRes, groupsRes, templesRes, jainCentersRes, dharamshalasRes, membersRes] = await Promise.all([
        api.get("/tracking/routes"),
        api.get("/monks"),
        api.get("/monks/groups").catch(() => ({ data: { data: [] } })),
        api.get("/temples").catch(() => ({ data: { data: [] } })),
        api.get("/jain-centers").catch(() => ({ data: { data: [] } })),
        api.get("/dharamshalas").catch(() => ({ data: { data: [] } })),
        api.get("/members").catch(() => ({ data: { data: [] } }))
      ]);
      setRows(routesRes.data?.data || []);
      setMonks(monksRes.data?.data?.items || monksRes.data?.data || []);
      setGroups(groupsRes.data?.data || []);
      setMembers(membersRes.data?.data?.items || membersRes.data?.data || []);

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
      targetType: "MONK",
      monkId: "",
      monkGroupId: "",
      participantMonkIds: [],
      contactPersonIds: [],
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
      targetType: r.monkGroupId ? "GROUP" : "MONK",
      monkId: r.monkId || "",
      monkGroupId: r.monkGroupId || "",
      participantMonkIds: r.participantMonkIds || [],
      contactPersonIds: r.contactPersonIds || [],
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
      monkId: form.targetType === "MONK" ? (form.monkId || undefined) : undefined,
      monkGroupId: form.targetType === "GROUP" ? (form.monkGroupId || undefined) : undefined,
      participantMonkIds: form.targetType === "GROUP" ? form.participantMonkIds : [],
      contactPersonIds: form.contactPersonIds,
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
    { key: "name", header: t("Route Name"), render: (r) => <span className="font-semibold text-slate-800 cursor-pointer hover:underline hover:text-orange-600" onClick={() => setViewRoute(r)}>{r.name}</span> },
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
      <div className="flex gap-1 justify-end">
        <Button variant="ghost" size="icon" onClick={() => setViewRoute(r)}><Eye className="h-4 w-4 text-slate-500" /></Button>
        <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Edit className="h-4 w-4 text-slate-500" /></Button>
      </div>
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
            <div><Label className="text-xs">{t("Route Name *")}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("e.g. Mumbai-Pune Highway Route")} className="mt-1" /></div>
            
            <div><Label className="text-xs">{t("Vihar Date *")}</Label><Input type="date" value={form.journeyDate} onChange={(e) => setForm({ ...form, journeyDate: e.target.value })} className="mt-1" /></div>

            <div className="flex gap-4 items-center">
               <Label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="targetType" value="MONK" checked={form.targetType === "MONK"} onChange={() => setForm({ ...form, targetType: "MONK", monkGroupId: "", participantMonkIds: [] })} /> {t("Individual Monk")}</Label>
               <Label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="targetType" value="GROUP" checked={form.targetType === "GROUP"} onChange={() => setForm({ ...form, targetType: "GROUP", monkId: "" })} /> {t("Monk Group")}</Label>
            </div>

            {form.targetType === "MONK" && (
              <div>
                <Label className="text-xs">{t("Monk / Sadhvi (Optional)")}</Label>
                <SearchableSelect
                  value={form.monkId}
                  onValueChange={(val) => setForm({ ...form, monkId: val })}
                  options={monks.map((m) => ({ value: m.id, label: `${m.dikshaName} (${m.publicId})` }))}
                  placeholder={t("Select a monk")}
                  searchPlaceholder={t("Search monks…")}
                  className="mt-1"
                />
              </div>
            )}

            {form.targetType === "GROUP" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">{t("Sangh / Group (Optional)")}</Label>
                  <SearchableSelect
                    value={form.monkGroupId}
                    onValueChange={(val) => setForm({ ...form, monkGroupId: val, participantMonkIds: monks.filter(m => m.groupId === val).map(m => m.id) })}
                    options={groups.map((g) => ({ value: g.id, label: g.name }))}
                    placeholder={t("Select a group")}
                    searchPlaceholder={t("Search groups…")}
                    className="mt-1"
                  />
                </div>
                
                {form.monkGroupId && (
                  <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                    <Label className="text-xs mb-2 block">{t("Select Participating Monks")}</Label>
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                      {monks.filter(m => m.groupId === form.monkGroupId).map(m => (
                         <Label key={m.id} className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                           <input type="checkbox" checked={form.participantMonkIds.includes(m.id)} 
                             onChange={(e) => {
                               const ids = e.target.checked ? [...form.participantMonkIds, m.id] : form.participantMonkIds.filter(id => id !== m.id);
                               setForm({ ...form, participantMonkIds: ids });
                             }}
                           />
                           {m.dikshaName}
                         </Label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <Label className="text-xs">{t("Contact Persons (Optional)")}</Label>
              <SearchableSelect
                multiple
                value={form.contactPersonIds}
                onValueChange={(val) => setForm({ ...form, contactPersonIds: val })}
                options={members.map((m) => ({ value: m.id, label: `${m.fullName || (m.firstName + ' ' + (m.surname || ''))} (${m.publicId})` }))}
                placeholder={t("Select contact persons")}
                searchPlaceholder={t("Search members…")}
                className="mt-1"
              />
            </div>
            
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


          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>{t("Cancel")}</Button>
            <Button onClick={saveRoute} disabled={saving}>{saving ? t("Saving...") : t("Save Route")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* View Route Details Modal */}
      <Dialog open={!!viewRoute} onOpenChange={(val) => !val && setViewRoute(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Navigation className="h-5 w-5 text-orange-500" />
              {viewRoute?.name}
            </DialogTitle>
          </DialogHeader>
          
          {viewRoute && (
            <div className="space-y-6 pt-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{t("Vihar Target")}</p>
                  {viewRoute.monkId ? (
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-5 w-5 text-slate-600" />
                      <span className="font-medium">{viewRoute.monk?.dikshaName || "Unknown Monk"}</span>
                    </div>
                  ) : viewRoute.monkGroupId ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-slate-600" />
                        <span className="font-medium">{viewRoute.monkGroup?.name || "Unknown Group"}</span>
                      </div>
                      <div className="pl-7">
                        <p className="text-xs text-slate-500 mb-1">{t("Participating Monks:")}</p>
                        <ul className="text-sm list-disc pl-4 space-y-1">
                          {(viewRoute.participantMonkIds || []).map(id => {
                             const monk = monks.find(m => m.id === id);
                             return <li key={id}>{monk?.dikshaName || "Unknown"}</li>;
                          })}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-500">None</span>
                  )}
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{t("Vihar Date")}</p>
                    <p className="font-medium">{viewRoute.journeyDate ? new Date(viewRoute.journeyDate).toLocaleDateString() : "TBD"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{t("Contact Persons")}</p>
                    {(viewRoute.contactPersonIds || []).length > 0 ? (
                      <ul className="text-sm list-disc pl-4 space-y-1">
                        {viewRoute.contactPersonIds.map(id => {
                           const member = members.find(m => m.id === id);
                           return <li key={id}>{member ? `${member.fullName || (member.firstName + ' ' + (member.surname || ''))} (${member.publicId})` : "Unknown"}</li>;
                        })}
                      </ul>
                    ) : (
                      <span className="text-sm text-slate-500">None Assigned</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-3 pb-2 border-b">{t("Route Timeline")}</h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {(viewRoute.stops || []).map((stop, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-orange-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col">
                        <span className="font-bold text-slate-800">{stop.templeName}</span>
                        {stop.dateTime && (
                          <span className="text-xs text-slate-500 mt-1">
                            {new Date(stop.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        )}
                        {stop.status === 'COMPLETED' && <Badge className="bg-green-500 w-fit mt-2">Completed</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setViewRoute(null)}>{t("Close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
