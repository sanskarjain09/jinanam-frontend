import React from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

export default function ContactPage() {
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
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-16">
        <h1 className="text-4xl font-brand font-bold text-[#00004d] mb-6">{t("Contact Us")}</h1>
        <div className="prose prose-slate max-w-none">
          <p>{t("Get in touch with the JiNANAM team.")}</p>
          <ul className="list-disc pl-5 mt-4">
            <li><strong>Email:</strong> support@jinanam.org</li>
            <li><strong>Phone:</strong> +91 99999 00000</li>
            <li><strong>Location:</strong> Ahmedabad, India</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
