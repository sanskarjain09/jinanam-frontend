import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft, Clock, Info, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { memberClient } from "@/lib/memberClient";
import { PathshalaBookingModal } from "@/components/modals/PathshalaBookingModal";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function MemberPathshalaDetailPage() {
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
      toast.error(t("Failed to load Pathshala details."));
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
            <BookOpen className="h-5 w-5 text-purple-500" />
            {t("Pathshala Details")}
          </h1>
          <p className="text-[11px] text-slate-500">{orgData.name}</p>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="info">{t("Info & Timings")}</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-purple-600" />
                {t("About Pathshala")}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t("Join religious studies and classes at")} {orgData.name}. {t("Our Pathshala offers structured sessions for spiritual growth and knowledge.")}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <h3 className="text-sm font-bold text-purple-800 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t("Class Timings")}
              </h3>
              <div className="text-sm text-purple-700 space-y-2">
                <p>{t("Please contact the management for the exact schedule as timings may vary based on the batch and age group.")}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-2">{t("Important Rules")}</h3>
              <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                <li>{t("Punctuality is strictly enforced.")}</li>
                <li>{t("Appropriate attire is required for all sessions.")}</li>
                <li>{t("Study materials will be provided or advised upon enrollment.")}</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t sm:relative sm:border-0 sm:bg-transparent sm:p-0 z-20">
          <Button 
            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl"
            onClick={() => setBookModalOpen(true)}
          >
            <CalendarCheck className="w-4 h-4 mr-2" />
            {t("Enroll / Book Session")}
          </Button>
        </div>
      </div>

      <PathshalaBookingModal 
        open={bookModalOpen} 
        onClose={() => setBookModalOpen(false)} 
        orgId={id} 
      />
    </div>
  );
}
