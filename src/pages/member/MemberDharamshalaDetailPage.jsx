import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BedDouble, ArrowLeft, Clock, Info, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { memberClient } from "@/lib/memberClient";
import { DharamshalaBookingModal } from "@/components/modals/DharamshalaBookingModal";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function MemberDharamshalaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState(null);
  const [bookModalOpen, setBookModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await memberClient.get(`/temples/${id}`);
      setOrgData(res.data?.data);
    } catch (error) {
      console.error(error);
      toast.error(t("Failed to load Dharamshala details."));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!orgData) {
    return <div className="p-6 text-center text-slate-500">{t("Not found.")}</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-blue-500" />
            {t("Dharamshala Details")}
          </h1>
          <p className="text-[11px] text-slate-500">{orgData.name}</p>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="info">{t("Info & Rules")}</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                {t("About Dharamshala")}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t("Experience a peaceful stay at")} {orgData.name}. {t("Our Dharamshala provides clean and comfortable accommodation for pilgrims and visitors.")}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t("Check-in / Check-out")}
              </h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div className="flex justify-between">
                  <span>{t("Check-in time")}:</span>
                  <span className="font-semibold">12:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Check-out time")}:</span>
                  <span className="font-semibold">11:00 AM</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-2">{t("Important Rules")}</h3>
              <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                <li>{t("Valid ID proof is required at the time of check-in.")}</li>
                <li>{t("Alcohol and non-vegetarian food are strictly prohibited.")}</li>
                <li>{t("Please maintain silence in the premises.")}</li>
                <li>{t("Booking is subject to availability and management approval.")}</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t sm:relative sm:border-0 sm:bg-transparent sm:p-0 z-20">
          <Button 
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl"
            onClick={() => setBookModalOpen(true)}
          >
            <CalendarCheck className="w-4 h-4 mr-2" />
            {t("Book Stay")}
          </Button>
        </div>
      </div>

      <DharamshalaBookingModal 
        open={bookModalOpen} 
        onClose={() => setBookModalOpen(false)} 
        orgId={id} 
      />
    </div>
  );
}
