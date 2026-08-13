import { useEffect, useState } from "react";
import { api, extractErrorMessage, API_BASE } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Building, DoorOpen, Upload, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useOrgs } from "@/hooks/useOrgs";
import { OrgSelect } from "@/components/common/OrgSelect";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

export default function RoomsPage() {
  const { t } = useLanguage();
  const { user, isSuperAdmin } = useAuth();
  const { orgs } = useOrgs();
  const [selectedOrg, setSelectedOrg] = useState("");

  const dharamshalas = orgs.filter((o) => o.type === "DHARAMSHALA");
  const orgId = user?.organizationIds?.[0] || selectedOrg || (isSuperAdmin ? dharamshalas[0]?.id : undefined);

  const [loading, setLoading] = useState(false);
  const [structure, setStructure] = useState(null);
  const [buildings, setBuildings] = useState([]);
  
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [selectedWingId, setSelectedWingId] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [newRoom, setNewRoom] = useState({
    name: "",
    type: "ROOM",
    capacity: 2,
    pricePerUnit: 0,
    roomNumber: "",
    bedType: "Double",
    images: []
  });

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

  const handleAddRoom = async () => {
    if (!selectedWingId) {
      toast.error("Please select a floor/wing first.");
      return;
    }
    if (!newRoom.name.trim()) return;
    
    setSaving(true);
    try {
      await api.post(`/dharamshalas/wings/${selectedWingId}/rooms`, { ...newRoom });
      toast.success(t("Room added successfully!"));
      setIsAddModalOpen(false);
      setNewRoom({ name: "", type: "ROOM", capacity: 2, pricePerUnit: 0, roomNumber: "", bedType: "Double", images: [] });
      loadStructure();
    } catch (e) {
      toast.error(extractErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  // Helper to get all rooms flattened for view
  const allRooms = [];
  buildings.forEach(b => {
    b.wings?.forEach(w => {
      w.rooms?.forEach(r => {
        allRooms.push({ ...r, buildingName: b.name, wingName: w.name });
      });
    });
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title={t("Rooms Management")} 
          description={t("Manage rooms, capacities, and pricing.")} 
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
          {t("Please select a Dharamshala to manage rooms.")}
        </Card>
      ) : loading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-border">
            <div className="flex items-center gap-4">
               {/* Quick stats */}
               <div className="text-sm">
                 <span className="text-muted-foreground">Total Rooms: </span>
                 <span className="font-bold text-lg">{allRooms.length}</span>
               </div>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-700 hover:bg-purple-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              {t("Add Room")}
            </Button>
          </div>

          {allRooms.length === 0 ? (
            <EmptyState 
              icon={DoorOpen}
              title={t("No Rooms Found")}
              description={t("Start by adding rooms to your buildings/floors.")}
              action={<Button onClick={() => setIsAddModalOpen(true)}>{t("Add Room")}</Button>}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allRooms.map((r) => (
                <Card key={r.id} className="p-5 flex flex-col justify-between border-t-4 border-t-purple-500 hover:shadow-md transition-all gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{r.name}</h3>
                      <p className="text-xs text-muted-foreground">{r.buildingName} • {r.wingName}</p>
                    </div>
                    <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-medium">
                      ₹{r.pricePerUnit}/night
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Capacity:</span> {r.capacity} Pax</div>
                    <div><span className="text-muted-foreground">Type:</span> {r.type}</div>
                    <div><span className="text-muted-foreground">Bed:</span> {r.bedType || 'N/A'}</div>
                    <div><span className="text-muted-foreground">Status:</span> {r.status}</div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("Add New Room")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Building")}</label>
              <SearchableSelect
                options={buildings.map(b => ({ value: b.id, label: b.name }))}
                value={selectedBuildingId}
                onValueChange={(val) => { setSelectedBuildingId(val); setSelectedWingId(""); }}
                placeholder="Select Building"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Floor / Wing")}</label>
              <SearchableSelect
                options={(buildings.find(b => b.id === selectedBuildingId)?.wings || []).map(w => ({ value: w.id, label: w.name }))}
                value={selectedWingId}
                onValueChange={setSelectedWingId}
                placeholder="Select Floor"
                disabled={!selectedBuildingId}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Room Name / Category")}</label>
              <Input 
                value={newRoom.name}
                onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                placeholder={t("e.g. Deluxe AC Room, 101")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Room Number")}</label>
              <Input 
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})}
                placeholder={t("e.g. 101")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Capacity (Pax)")}</label>
              <Input 
                type="number"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value) || 2})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Price per Night (₹)")}</label>
              <Input 
                type="number"
                value={newRoom.pricePerUnit}
                onChange={(e) => setNewRoom({...newRoom, pricePerUnit: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>{t("Cancel")}</Button>
            <Button onClick={handleAddRoom} disabled={!newRoom.name.trim() || !selectedWingId || saving} className="bg-purple-700 text-white">
              {saving ? t("Saving...") : t("Save Room")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
