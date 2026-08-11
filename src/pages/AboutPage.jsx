import React from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#00004d]/95 text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link to="/info" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-[#FFC107] flex items-center justify-center shadow-md overflow-hidden p-1">
              <img src="/logo.png" alt="JiNANAM Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-brand text-xl leading-none tracking-tight">JiNANAM</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-white/80">
            <Link to="/info" className="hover:text-[#FFC107] transition-colors">{t("Home")}</Link>
            <Link to="/info/about" className="hover:text-[#FFC107] transition-colors">{t("About")}</Link>
            <Link to="/info/contact" className="hover:text-[#FFC107] transition-colors">{t("Contact")}</Link>
            <Link to="/info/policy" className="hover:text-[#FFC107] transition-colors">{t("Policy")}</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-16">
        <h1 className="text-4xl font-brand font-bold text-[#00004d] mb-6">{t("About Us")}</h1>
        <div className="prose prose-slate max-w-none">
          <p>
            {t("JiNANAM is a unified platform for the modern Jain community, seamlessly integrating temples, dharamshalas, monks, and members.")}
          </p>
          <p>
            {t("Our mission is to bring order to your seva, empowering organizations to manage bookings, donations, events, monk tracking, and much more in real-time.")}
          </p>
        </div>
      </main>
    </div>
  );
}
