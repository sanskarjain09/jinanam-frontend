import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Clock,
  Utensils,
  Ticket,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";

const BhojanshalaManagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "timings";

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bhojanshala Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage timings, pricing, menus, and booking passes.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar">
          <button
            onClick={() => handleTabChange("timings")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              currentTab === "timings"
                ? "border-orange-500 text-orange-600 bg-orange-50/50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Clock className="w-4 h-4" />
            Timings & Prices
          </button>
          <button
            onClick={() => handleTabChange("menu")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              currentTab === "menu"
                ? "border-orange-500 text-orange-600 bg-orange-50/50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Utensils className="w-4 h-4" />
            Menu Management
          </button>
          <button
            onClick={() => handleTabChange("passes")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              currentTab === "passes"
                ? "border-orange-500 text-orange-600 bg-orange-50/50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Ticket className="w-4 h-4" />
            Pass Management
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-50/50 min-h-[500px]">
          {currentTab === "timings" && <TimingsTab />}
          {currentTab === "menu" && <MenuTab />}
          {currentTab === "passes" && <PassesTab />}
        </div>
      </div>
    </div>
  );
};

export default BhojanshalaManagementPage;

// --- Tab Components ---

const TimingsTab = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-slate-800 border-b pb-4">Set Timings & Charges</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Breakfast */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              Breakfast
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 font-medium">Timing (e.g., 08:00 AM - 10:00 AM)</label>
                <input type="text" defaultValue="08:00 AM - 10:00 AM" className="w-full mt-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium">Charge (₹)</label>
                <input type="number" defaultValue="50" className="w-full mt-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Lunch */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Lunch
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 font-medium">Timing (e.g., 12:00 PM - 02:00 PM)</label>
                <input type="text" defaultValue="12:00 PM - 02:00 PM" className="w-full mt-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium">Charge (₹)</label>
                <input type="number" defaultValue="100" className="w-full mt-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Dinner */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Dinner
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 font-medium">Timing (e.g., 06:00 PM - 08:30 PM)</label>
                <input type="text" defaultValue="05:30 PM - 07:30 PM" className="w-full mt-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium">Charge (₹)</label>
                <input type="number" defaultValue="100" className="w-full mt-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const MenuTab = () => {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const mockMenu = [
    { id: 1, type: "Breakfast", items: "Poha, Jalebi, Tea, Milk", status: "Active" },
    { id: 2, type: "Lunch", items: "Roti, Dal, Rice, 2 Sabzi, Buttermilk, Sweet", status: "Active" },
    { id: 3, type: "Dinner", items: "Khichdi, Kadhi, Bhakhri, Sabzi", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                selectedDay === day 
                ? "bg-orange-100 text-orange-700 border border-orange-200" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Add Menu Item
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
          <h3 className="font-medium text-slate-800">Menu for {selectedDay}</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {mockMenu.map((menu) => (
            <div key={menu.id} className="p-4 hover:bg-slate-50 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                    menu.type === "Breakfast" ? "bg-yellow-100 text-yellow-800" :
                    menu.type === "Lunch" ? "bg-orange-100 text-orange-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {menu.type}
                  </span>
                </div>
                <p className="text-slate-700 text-sm">{menu.items}</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PassesTab = () => {
  const mockBookings = [
    { id: "BKG-101", name: "Rahul Jain", date: "12 Aug 2026", meal: "Lunch", guests: 2, status: "Approved", amount: "₹200" },
    { id: "BKG-102", name: "Amit Shah", date: "12 Aug 2026", meal: "Dinner", guests: 4, status: "Pending", amount: "₹400" },
    { id: "BKG-103", name: "Neha Mehta", date: "13 Aug 2026", meal: "Breakfast", guests: 1, status: "Checked-in", amount: "₹50" },
    { id: "BKG-104", name: "Suresh Doshi", date: "13 Aug 2026", meal: "Lunch", guests: 3, status: "Cancelled", amount: "₹300" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved": return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3"/> Approved</span>;
      case "Pending": return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3"/> Pending</span>;
      case "Checked-in": return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"><CheckCircle2 className="w-3 h-3"/> Checked-in</span>;
      case "Cancelled": return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="w-3 h-3"/> Cancelled</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search bookings by ID or Name..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 bg-white">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Create Pass
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
            <tr>
              <th className="px-6 py-4">Booking ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Date & Meal</th>
              <th className="px-6 py-4">Guests</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockBookings.map((bkg) => (
              <tr key={bkg.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{bkg.id}</td>
                <td className="px-6 py-4 text-slate-700">{bkg.name}</td>
                <td className="px-6 py-4">
                  <div className="text-slate-900">{bkg.date}</div>
                  <div className="text-xs text-slate-500">{bkg.meal}</div>
                </td>
                <td className="px-6 py-4 text-slate-700">{bkg.guests}</td>
                <td className="px-6 py-4 text-slate-700 font-medium">{bkg.amount}</td>
                <td className="px-6 py-4">{getStatusBadge(bkg.status)}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
