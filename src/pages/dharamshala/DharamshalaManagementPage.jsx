import { useEffect, useState } from "react";
import { api, extractErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Building, DoorOpen, PlusCircle, IndianRupee, Layers } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useOrgs } from "@/hooks/useOrgs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { OrgSelect } from "@/components/common/OrgSelect";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Upload, Image as ImageIcon } from "lucide-react";

export default function DharamshalaManagementPage() {
  const { t } = useLanguage();
  const { user, isSuperAdmin } = useAuth();
  const { orgs } = useOrgs();
  const [selectedOrg, setSelectedOrg] = useState("");

  const dharamshalas = orgs.filter((o) => o.type === "DHARAMSHALA");
  const orgId = user?.organizationIds?.[0] || selectedOrg || (isSuperAdmin ? dharamshalas[0]?.id : undefined);

  const [loading, setLoading] = useState(false);
  const [structure, setStructure] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [rulesText, setRulesText] = useState("");
  const [gallery, setGallery] = useState([]);

  // Modals
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  // States for adding
  const [activeBuildingId, setActiveBuildingId] = useState(null);
  const [activeWingId, setActiveWingId] = useState(null);

  const [newBuildingName, setNewBuildingName] = useState("");
  const [newFloorName, setNewFloorName] = useState("");
  
  const [newRoom, setNewRoom] = useState({
    name: "",
    type: "ROOM",
    category: "Non-AC", // AC, Non-AC, Cooler
    capacity: 2,
    pricePerUnit: 0,
    roomNumber: "",
    bedType: "Double",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!orgId) return;
    loadStructure();
  }, [orgId]);

  const loadStructure = async () => {
    setLoading(true);
    try {
      const [structRes, orgRes] = await Promise.all([
        api.get(`/dharamshalas/${orgId}/structure`),
        api.get(`/dharamshalas/${orgId}`)
      ]);
      setStructure(structRes.data?.data);
      setBuildings(structRes.data?.data?.buildings || []);
      
      const org = orgRes.data?.data;
      setOrganization(org);
      setFacilities(org?.facilities || []);
      setRulesText(org?.rulesText || "");
      setGallery(org?.gallery || []);
    } catch (e) {
      toast.error(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFacilities = async () => {
    setSaving(true);
    try {
      await api.patch(`/dharamshalas/${orgId}`, { facilities });
      toast.success(t("Amenities updated successfully!"));
      loadStructure();
    } catch (e) {
      toast.error(extractErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRules = async () => {
    setSaving(true);
    try {
      await api.patch(`/dharamshalas/${orgId}`, { rulesText });
      toast.success(t("Rules updated successfully!"));
      loadStructure();
    } catch (e) {
      toast.error(extractErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    setSaving(true);
    try {
      await api.post(`/dharamshalas/${orgId}/gallery/bulk`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(t("Images uploaded successfully!"));
      loadStructure();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSaving(false);
      e.target.value = null; // Reset input
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm(t("Are you sure you want to delete this image?"))) return;
    setSaving(true);
    try {
      await api.delete(`/dharamshalas/${orgId}/gallery/${imageId}`);
      toast.success(t("Image deleted successfully!"));
      loadStructure();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!organization) return;
    setSaving(true);
    try {
      const payload = { dharamshalaPublished: !organization.dharamshalaPublished };
      await api.patch(`/temples/${orgId}`, payload);
      toast.success(payload.dharamshalaPublished ? "Dharamshala published successfully!" : "Dharamshala unpublished.");
      setOrganization({ ...organization, dharamshalaPublished: payload.dharamshalaPublished });
    } catch (e) {
      toast.error(extractErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const COMMON_AMENITIES = [
    "Parking", "Lift", "WiFi", "Hot Water", "AC", "Cooler", 
    "Geyser", "Wheelchair Accessible", "Security Guard", "CCTV",
    "24/7 Check-in", "Daily Housekeeping"
  ];


  const handleAddBuilding = async () => {
    if (!newBuildingName.trim()) return;
    setSaving(true);
    try {
      await api.post(`/dharamshalas/${orgId}/buildings`, { name: newBuildingName.trim() });
      toast.success(t("Building added successfully!"));
      setIsBuildingModalOpen(false);
      setNewBuildingName("");
      loadStructure();
    } catch (e) {
      toast.error(extractErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleAddFloor = async () => {
    if (!newFloorName.trim() || !activeBuildingId) return;
    setSaving(true);
    try {
      await api.post(`/dharamshalas/buildings/${activeBuildingId}/wings`, { name: newFloorName.trim() });
      toast.success(t("Floor added successfully!"));
      setIsFloorModalOpen(false);
      setNewFloorName("");
      loadStructure();
    } catch (e) {
      toast.error(extractErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleAddRoom = async () => {
    if (!newRoom.name.trim() || !activeWingId) return;
    setSaving(true);
    try {
      // Create room with additional properties
      await api.post(`/dharamshalas/wings/${activeWingId}/rooms`, { ...newRoom });
      toast.success(t("Room added successfully!"));
      setIsRoomModalOpen(false);
      setNewRoom({ name: "", type: "ROOM", category: "Non-AC", capacity: 2, pricePerUnit: 0, roomNumber: "", bedType: "Double" });
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
          title={t("Dharamshala Management")} 
          description={t("Manage buildings, rooms, categories, prices and more.")} 
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
        {organization && (
          <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
            <span className="text-sm font-medium text-slate-700">Published</span>
            <button
              onClick={handleTogglePublish}
              disabled={saving}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${organization.dharamshalaPublished ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${organization.dharamshalaPublished ? 'translate-x-4' : 'translate-x-1'}`} />
            </button>
          </div>
        )}
      </div>

      {!orgId ? (
        <Card className="p-8 text-center text-muted-foreground">
          {t("Please select a Dharamshala to manage.")}
        </Card>
      ) : loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <Tabs defaultValue="structure" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="structure">{t("Structure & Pricing")}</TabsTrigger>
            <TabsTrigger value="amenities">{t("Amenities")}</TabsTrigger>
            <TabsTrigger value="rules">{t("Rules")}</TabsTrigger>
            <TabsTrigger value="gallery">{t("Gallery")}</TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="mt-6 space-y-4">
            <div className="flex justify-between items-center bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div>
                <h3 className="font-semibold text-purple-900">{t("Property Structure")}</h3>
                <p className="text-sm text-purple-700">{t("Add buildings, then floors, and finally rooms with prices and categories.")}</p>
              </div>
              <Button onClick={() => setIsBuildingModalOpen(true)} className="bg-purple-700 text-white hover:bg-purple-800">
                <Plus className="h-4 w-4 mr-2" />
                {t("Add Building")}
              </Button>
            </div>

            {buildings.length === 0 ? (
              <EmptyState 
                icon={Building}
                title={t("No Buildings Found")}
                description={t("Start by adding a building. Then you can add floors and rooms to it.")}
                action={<Button onClick={() => setIsBuildingModalOpen(true)}>{t("Add Building")}</Button>}
              />
            ) : (
              <Accordion type="multiple" className="w-full space-y-4">
                {buildings.map((b) => (
                  <AccordionItem value={`building-${b.id}`} key={b.id} className="border rounded-lg bg-card shadow-sm overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 text-left">
                        <div className="bg-purple-100 p-2 rounded-md">
                          <Building className="h-5 w-5 text-purple-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{b.name}</h3>
                          <p className="text-sm text-muted-foreground">{b.wings?.length || 0} Floors</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-2 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-foreground">{t("Floors / Wings")}</h4>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => { setActiveBuildingId(b.id); setIsFloorModalOpen(true); }}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          {t("Add Floor")}
                        </Button>
                      </div>

                      {(!b.wings || b.wings.length === 0) ? (
                        <div className="text-center p-6 bg-muted/30 rounded-md border border-dashed">
                          <Layers className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                          <p className="text-sm text-muted-foreground">{t("No floors added to this building yet.")}</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {b.wings.map((w) => (
                            <div key={w.id} className="border rounded-md bg-background overflow-hidden">
                              <div className="bg-muted/50 px-4 py-3 flex justify-between items-center border-b">
                                <div className="font-medium flex items-center gap-2">
                                  <Layers className="h-4 w-4 text-primary" />
                                  {w.name}
                                </div>
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => { setActiveWingId(w.id); setIsRoomModalOpen(true); }}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  {t("Add Room")}
                                </Button>
                              </div>
                              
                              <div className="p-4">
                                {(!w.rooms || w.rooms.length === 0) ? (
                                  <p className="text-sm text-muted-foreground text-center py-4">{t("No rooms added to this floor yet.")}</p>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {w.rooms.map((r) => (
                                      <Card key={r.id} className="p-4 border-l-4 border-l-blue-500">
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <h5 className="font-semibold">{r.name}</h5>
                                            {r.roomNumber && <p className="text-xs text-muted-foreground">Room No: {r.roomNumber}</p>}
                                          </div>
                                          <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                                            {r.category || "Standard"}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                                          <div className="flex items-center gap-1">
                                            <IndianRupee className="h-3 w-3" />
                                            {r.pricePerUnit || 0}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <DoorOpen className="h-3 w-3" />
                                            {r.capacity} {t("Beds")}
                                          </div>
                                        </div>
                                      </Card>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </TabsContent>

          <TabsContent value="amenities">
            <div className="border rounded-lg bg-card overflow-hidden">
              <div className="bg-muted/30 px-6 py-4 border-b">
                <h3 className="text-lg font-medium">{t("Amenities Management")}</h3>
                <p className="text-sm text-muted-foreground">{t("Configure parking, lift, wifi and other global amenities here.")}</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {COMMON_AMENITIES.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/20">
                      <Checkbox 
                        id={`facility-${amenity}`} 
                        checked={facilities.includes(amenity)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFacilities([...facilities, amenity]);
                          } else {
                            setFacilities(facilities.filter(f => f !== amenity));
                          }
                        }}
                      />
                      <label htmlFor={`facility-${amenity}`} className="text-sm font-medium leading-none cursor-pointer">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleSaveFacilities} disabled={saving} className="bg-purple-700 text-white">
                    {saving ? t("Saving...") : t("Save Amenities")}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules">
             <div className="border rounded-lg bg-card overflow-hidden">
              <div className="bg-muted/30 px-6 py-4 border-b">
                <h3 className="text-lg font-medium">{t("Rules & Policies")}</h3>
                <p className="text-sm text-muted-foreground">{t("Set check-in/out times, cancellation policies, etc.")}</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("Rules & Regulations")}</label>
                  <Textarea 
                    value={rulesText}
                    onChange={(e) => setRulesText(e.target.value)}
                    placeholder={t("Enter rules, check-in policies, ID requirements, etc.")}
                    className="min-h-[200px]"
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveRules} disabled={saving} className="bg-purple-700 text-white">
                    {saving ? t("Saving...") : t("Save Rules")}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery">
             <div className="border rounded-lg bg-card overflow-hidden">
              <div className="bg-muted/30 px-6 py-4 border-b flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t("Dharamshala Gallery")}</h3>
                  <p className="text-sm text-muted-foreground">{t("Upload images of the exterior, reception, rooms, etc.")}</p>
                </div>
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    id="gallery-upload"
                    className="hidden"
                    onChange={handleGalleryUpload}
                  />
                  <label htmlFor="gallery-upload">
                    <Button variant="outline" asChild disabled={saving}>
                      <span className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        {saving ? t("Uploading...") : t("Upload Images")}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
              
              <div className="p-6">
                {(!gallery || gallery.length === 0) ? (
                  <EmptyState 
                    icon={ImageIcon}
                    title={t("No Images Found")}
                    description={t("Upload images to show in your Dharamshala profile.")}
                  />
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.map((img) => (
                      <div key={img._id || img.id} className="relative group rounded-lg overflow-hidden border aspect-video bg-muted/20">
                        <img 
                          src={img.url} 
                          alt="Gallery" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => handleDeleteImage(img._id || img.id)}
                            disabled={saving}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

        </Tabs>
      )}

      {/* Building Modal */}
      <Dialog open={isBuildingModalOpen} onOpenChange={setIsBuildingModalOpen}>
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
                placeholder={t("e.g. Main Block")}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBuildingModalOpen(false)}>{t("Cancel")}</Button>
            <Button onClick={handleAddBuilding} disabled={!newBuildingName.trim() || saving} className="bg-purple-700 text-white">
              {saving ? t("Saving...") : t("Save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floor Modal */}
      <Dialog open={isFloorModalOpen} onOpenChange={setIsFloorModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Add New Floor / Wing")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Floor Name")}</label>
              <Input 
                value={newFloorName}
                onChange={(e) => setNewFloorName(e.target.value)}
                placeholder={t("e.g. Ground Floor, First Floor, North Wing")}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFloorModalOpen(false)}>{t("Cancel")}</Button>
            <Button onClick={handleAddFloor} disabled={!newFloorName.trim() || saving} className="bg-purple-700 text-white">
              {saving ? t("Saving...") : t("Save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Room Modal */}
      <Dialog open={isRoomModalOpen} onOpenChange={setIsRoomModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("Add New Room")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">{t("Room Name / Title")}</label>
              <Input 
                value={newRoom.name}
                onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                placeholder={t("e.g. Deluxe Family Room")}
                autoFocus
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
              <label className="text-sm font-medium">{t("Category")}</label>
              <Select value={newRoom.category} onValueChange={(val) => setNewRoom({...newRoom, category: val})}>
                <SelectTrigger>
                  <SelectValue placeholder={t("Select Category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Non-AC">{t("Non-AC")}</SelectItem>
                  <SelectItem value="AC">{t("AC")}</SelectItem>
                  <SelectItem value="Cooler">{t("Cooler")}</SelectItem>
                  <SelectItem value="Dormitory">{t("Dormitory")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Price (per day)")}</label>
              <Input 
                type="number"
                value={newRoom.pricePerUnit}
                onChange={(e) => setNewRoom({...newRoom, pricePerUnit: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Bed Capacity")}</label>
              <Input 
                type="number"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="col-span-2 space-y-2 mt-2">
              <label className="text-sm font-medium">{t("Room Images")}</label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
                <p className="text-sm mb-2">{t("Image upload will be added shortly")}</p>
                <Button variant="outline" size="sm" disabled>{t("Upload Photo")}</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoomModalOpen(false)}>{t("Cancel")}</Button>
            <Button onClick={handleAddRoom} disabled={!newRoom.name.trim() || saving} className="bg-purple-700 text-white">
              {saving ? t("Saving...") : t("Save Room")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
