import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/common/PageHeader";
import { OrgSelect } from "@/components/common/OrgSelect";
import { useAuth } from "@/contexts/AuthContext";
import { useOrgs } from "@/hooks/useOrgs";
import { api, extractErrorMessage } from "@/lib/api";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { CalendarCheck, Eye, Check, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function DharamshalaBookingsPage() {
  const { t } = useLanguage();
  const { user, isSuperAdmin } = useAuth();
  const { orgs } = useOrgs();
  const [selectedOrg, setSelectedOrg] = useState("");

  const dharamshalas = orgs.filter((o) => o.type === "DHARAMSHALA");
  const orgId = user?.organizationIds?.[0] || selectedOrg || (isSuperAdmin ? dharamshalas[0]?.id : undefined);

  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (orgId) {
      fetchBookings();
    }
  }, [orgId]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/bookings/org/${orgId}`);
      setBookings(res.data?.data || []);
    } catch (e) {
      toast.error(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (bookingId, action, status) => {
    setActionLoading(true);
    try {
      if (action === "decision") {
        await api.post(`/bookings/${bookingId}/decision`, { decision: status, remarks: "" });
        toast.success(t(`Booking ${status.toLowerCase()} successfully.`));
      } else if (action === "check-in") {
        await api.post(`/bookings/${bookingId}/check-in`);
        toast.success(t("Check-in successful."));
      } else if (action === "check-out") {
        await api.post(`/bookings/${bookingId}/check-out`);
        toast.success(t("Check-out successful."));
      }
      fetchBookings();
      setIsViewModalOpen(false);
    } catch (e) {
      toast.error(extractErrorMessage(e));
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="text-yellow-600 bg-yellow-50">{t("Pending")}</Badge>;
      case "APPROVED":
        return <Badge variant="outline" className="text-blue-600 bg-blue-50">{t("Approved")}</Badge>;
      case "CHECKED_IN":
        return <Badge variant="outline" className="text-purple-600 bg-purple-50">{t("Checked In")}</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="text-green-600 bg-green-50">{t("Completed")}</Badge>;
      case "REJECTED":
      case "CANCELLED":
        return <Badge variant="outline" className="text-red-600 bg-red-50">{t(status)}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "ALL") return true;
    return b.status === activeTab;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title={t("Bookings Management")} 
          description={t("Manage member reservations, check-ins, and check-outs.")} 
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

      <div className="border rounded-lg bg-card">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3 sm:flex">
              <TabsTrigger value="ALL">{t("All")}</TabsTrigger>
              <TabsTrigger value="PENDING">{t("Pending")}</TabsTrigger>
              <TabsTrigger value="APPROVED">{t("Approved")}</TabsTrigger>
              <TabsTrigger value="CHECKED_IN" className="hidden sm:inline-flex">{t("Checked In")}</TabsTrigger>
              <TabsTrigger value="COMPLETED" className="hidden sm:inline-flex">{t("Completed")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title={t("No Bookings Found")}
              description={t("There are no bookings matching the selected filter.")}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Booking ID")}</TableHead>
                  <TableHead>{t("Member")}</TableHead>
                  <TableHead>{t("Check-In")}</TableHead>
                  <TableHead>{t("Check-Out")}</TableHead>
                  <TableHead>{t("Rooms")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking._id || booking.id}>
                    <TableCell className="font-medium text-xs">{(booking._id || booking.id).substring(0, 8).toUpperCase()}</TableCell>
                    <TableCell>
                      {booking.primaryOccupant?.firstName} {booking.primaryOccupant?.lastName}
                      <div className="text-xs text-muted-foreground">{booking.primaryOccupant?.mobile}</div>
                    </TableCell>
                    <TableCell>{format(new Date(booking.checkInDate), "dd MMM yyyy")}</TableCell>
                    <TableCell>{format(new Date(booking.checkOutDate), "dd MMM yyyy")}</TableCell>
                    <TableCell>{booking.rooms?.length || 1}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {t("View")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("Booking Details")}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">{t("Primary Occupant")}</h4>
                  <p className="font-medium">{selectedBooking.primaryOccupant?.firstName} {selectedBooking.primaryOccupant?.lastName}</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.primaryOccupant?.mobile}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">{t("Stay Dates")}</h4>
                  <p>{format(new Date(selectedBooking.checkInDate), "dd MMM yyyy")} - {format(new Date(selectedBooking.checkOutDate), "dd MMM yyyy")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">{t("Status")}</h4>
                  <div>{getStatusBadge(selectedBooking.status)}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">{t("Payment Summary")}</h4>
                  <p className="text-sm flex justify-between"><span>{t("Total Amount")}:</span> <span className="font-medium">₹{selectedBooking.totalAmount || 0}</span></p>
                  <p className="text-sm flex justify-between"><span>{t("Amount Paid")}:</span> <span className="font-medium text-green-600">₹{selectedBooking.amountPaid || 0}</span></p>
                  <p className="text-sm flex justify-between"><span>{t("Payment Status")}:</span> <span className="font-medium">{selectedBooking.paymentStatus}</span></p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">{t("Special Requests")}</h4>
                  <p className="text-sm whitespace-pre-wrap">{selectedBooking.specialRequests || t("None")}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            {selectedBooking?.status === "PENDING" && (
              <>
                <Button 
                  variant="destructive" 
                  disabled={actionLoading} 
                  onClick={() => handleAction(selectedBooking._id || selectedBooking.id, "decision", "REJECTED")}
                >
                  <X className="w-4 h-4 mr-2" />
                  {t("Reject")}
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white" 
                  disabled={actionLoading} 
                  onClick={() => handleAction(selectedBooking._id || selectedBooking.id, "decision", "APPROVED")}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {t("Approve")}
                </Button>
              </>
            )}
            
            {selectedBooking?.status === "APPROVED" && (
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white" 
                disabled={actionLoading} 
                onClick={() => handleAction(selectedBooking._id || selectedBooking.id, "check-in")}
              >
                {t("Check In")}
              </Button>
            )}

            {selectedBooking?.status === "CHECKED_IN" && (
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white" 
                disabled={actionLoading} 
                onClick={() => handleAction(selectedBooking._id || selectedBooking.id, "check-out")}
              >
                {t("Check Out")}
              </Button>
            )}

            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              {t("Close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
