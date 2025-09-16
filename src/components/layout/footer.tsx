
"use client";

import { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { t } = useLanguage();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-black text-gray-300 mt-auto pt-12 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white font-headline">{t('footer_about_title')}</h3>
            <p className="text-sm">
              {t('footer_about_description')}
            </p>
            <p className="text-sm pt-4">
              © {year} MeraShahar. {t('footer_copyright')}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white font-headline">{t('footer_contact_title')}</h3>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
              <p className="text-sm">{t('footer_contact_address')}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
              <p className="text-sm">+1 (234) 567-890</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
              <p className="text-sm">contact@citycorp.gov</p>
            </div>
             <div className="space-y-2 pt-2">
              <h4 className="font-medium text-white">{t('footer_contact_hours_title')}</h4>
              <p className="text-sm">{t('footer_contact_hours_weekdays')}</p>
              <p className="text-sm">{t('footer_contact_hours_weekends')}</p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white font-headline">{t('footer_follow_title')}</h3>
            <p className="text-sm">{t('footer_follow_description')}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
