import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Coffee, ArrowLeft, Clock, CalendarDays, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { memberClient } from "@/lib/memberClient";
import { BhojanshalaBookingModal } from "@/components/modals/BhojanshalaBookingModal";
import { MyBhojanshalaBookingsModal } from "@/components/modals/MyBhojanshalaBookingsModal";
import { Receipt } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function MemberBhojanshalaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [orgRes, menuRes] = await Promise.all([
        memberClient.get(`/temples/${id}`),
        memberClient.get(`/bhojanshala/${id}/menu`).catch(() => ({ data: { data: [] } }))
      ]);
      setOrgData(orgRes.data?.data);
      setMenuItems(menuRes.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error(t("Failed to load Bhojanshala details."));
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

  const bhojanshalaTimings = {
    BREAKFAST: {
      timing: orgData.bhojanshalaBreakfastTiming || "—",
      price: orgData.bhojanshalaBreakfastCharge || "—"
    },
    LUNCH: {
      timing: orgData.bhojanshalaLunchTiming || "—",
      price: orgData.bhojanshalaLunchCharge || "—"
    },
    DINNER: {
      timing: orgData.bhojanshalaDinnerTiming || "—",
      price: orgData.bhojanshalaDinnerCharge || "—"
    }
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const menuByDay = {};
  daysOfWeek.forEach(d => menuByDay[d] = []);
  (menuItems || []).forEach(item => {
    if (menuByDay[item.dayOfWeek]) {
      menuByDay[item.dayOfWeek].push(item);
    }
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Coffee className="h-5 w-5 text-orange-500" />
            {t("Bhojanshala Details")}
          </h1>
          <p className="text-[11px] text-slate-500">{orgData.name}</p>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        <Tabs defaultValue="timings">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timings">{t("Timings & Info")}</TabsTrigger>
            <TabsTrigger value="menu">{t("Menu")}</TabsTrigger>
          </TabsList>

          <TabsContent value="timings" className="mt-4 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                {t("Operating Hours")}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">{t("Breakfast")}</span>
                  <span className="text-slate-800 font-semibold">{bhojanshalaTimings.BREAKFAST.timing} {bhojanshalaTimings.BREAKFAST.price !== "—" ? `• ₹${bhojanshalaTimings.BREAKFAST.price}` : ""}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">{t("Lunch")}</span>
                  <span className="text-slate-800 font-semibold">{bhojanshalaTimings.LUNCH.timing} {bhojanshalaTimings.LUNCH.price !== "—" ? `• ₹${bhojanshalaTimings.LUNCH.price}` : ""}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">{t("Dinner (Choviyar)")}</span>
                  <span className="text-slate-800 font-semibold">{bhojanshalaTimings.DINNER.timing} {bhojanshalaTimings.DINNER.price !== "—" ? `• ₹${bhojanshalaTimings.DINNER.price}` : ""}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <h3 className="text-sm font-bold text-orange-800 mb-2">{t("Important Rules")}</h3>
              <ul className="text-xs text-orange-700 space-y-1 list-disc list-inside">
                <li>{t("Passes are required for meals.")}</li>
                <li>{t("Please arrive during the specified timings.")}</li>
                <li>{t("Choviyar must be completed before sunset.")}</li>
                {orgData.bhojanshalaRules && <li>{orgData.bhojanshalaRules}</li>}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="menu" className="mt-4 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-3">{t("Weekly Menu")}</h3>
              {menuItems.length > 0 ? (
                <div className="space-y-6">
                  {daysOfWeek.map(day => {
                    const dayItems = menuByDay[day];
                    if (!dayItems || dayItems.length === 0) return null;
                    return (
                      <div key={day} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                        <div className="font-bold text-sm text-slate-800 mb-3">{day}</div>
                        <div className="space-y-3">
                          {dayItems.map(item => {
                             const timingObj = bhojanshalaTimings[item.mealType] || {};
                             const timeStr = item.startTime ? `${item.startTime} - ${item.endTime}` : timingObj.timing;
                             const priceStr = item.price !== null && item.price !== undefined ? item.price : timingObj.price;

                             return (
                               <div key={item.id} className="text-xs text-slate-600">
                                 <div className="flex justify-between items-start mb-0.5">
                                   <span className="font-semibold text-orange-600 capitalize">{item.mealType.toLowerCase()}</span>
                                   {(timeStr !== "—" || priceStr !== "—") && (
                                     <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                       {timeStr !== "—" ? timeStr : ""} {priceStr !== "—" && `• ₹${priceStr}`}
                                     </span>
                                   )}
                                 </div>
                                 <div className="text-slate-800 font-medium text-[13px]">{item.itemName}</div>
                                 {item.description && <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>}
                               </div>
                             );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-slate-500 text-center py-4">{t("No menu configured.")}</div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t sm:relative sm:border-0 sm:bg-transparent sm:p-0 z-20 flex gap-2">
          <Button 
            variant="outline"
            className="w-14 h-12 rounded-xl shrink-0"
            onClick={() => setMyBookingsOpen(true)}
          >
            <Receipt className="w-5 h-5 text-slate-600" />
          </Button>
          <Button 
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl flex-1"
            onClick={() => setBookModalOpen(true)}
          >
            <Ticket className="w-4 h-4 mr-2" />
            {t("Book Passes")}
          </Button>
        </div>
      </div>

      <MyBhojanshalaBookingsModal open={myBookingsOpen} onClose={() => setMyBookingsOpen(false)} />
      <BhojanshalaBookingModal 
        open={bookModalOpen} 
        onClose={() => setBookModalOpen(false)} 
        orgId={id} 
      />
    </div>
  );
}
