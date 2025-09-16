
"use client";

import ReportForm from "@/components/report-form";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function ReportPage() {
  const { t } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-20rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // The hook will redirect
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">{t('report_title')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('report_subtitle')}
        </p>
      </div>

      <ReportForm />
    </div>
  );
}

    