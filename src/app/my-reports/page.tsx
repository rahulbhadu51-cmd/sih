
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useEffect, useState } from "react";
import { submitReportAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, WifiOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface Report {
    id: string;
    issueType: string;
    dateSubmitted: string;
    status: 'Resolved' | 'In Progress' | 'Submitted' | 'Pending';
    description: string;
    photoURL: string;
    photoHint?: string;
    location: { lat: number; lng: number };
    timeline?: Array<{ status: string; date: string }>;
}

const mockReports: Report[] = [
  {
    id: "1",
    issueType: "Pothole",
    dateSubmitted: "2024-07-28",
    status: "Resolved",
    description: "Large pothole on the main road, causing traffic issues.",
    photoURL: "https://picsum.photos/seed/report1/400/300",
    photoHint: "pothole road",
    location: { lat: 28.6139, lng: 77.209 },
    timeline: [
      { status: "Submitted", date: "2024-07-22" },
      { status: "In Progress", date: "2024-07-25" },
      { status: "Resolved", date: "2024-07-28" },
    ],
  },
  {
    id: "2",
    issueType: "Streetlight Not Working",
    dateSubmitted: "2024-07-26",
    status: "In Progress",
    description:
      "The streetlight at the corner of 5th and Elm has been out for 3 days.",
    photoURL: "https://picsum.photos/seed/report2/400/300",
    photoHint: "dark streetlight",
    location: { lat: 34.0522, lng: -118.2437 },
    timeline: [
      { status: "Submitted", date: "2024-07-26" },
      { status: "In Progress", date: "2024-07-27" },
    ],
  },
  {
    id: "3",
    issueType: "Sewerage Overflow",
    dateSubmitted: "2024-07-29",
    status: "Submitted",
    description:
      "Sewer is overflowing near the park entrance. Bad smell and unsanitary conditions.",
    photoURL: "https://picsum.photos/seed/report3/400/300",
    photoHint: "overflowing sewer",
    location: { lat: 40.7128, lng: -74.006 },
    timeline: [{ status: "Submitted", date: "2024-07-29" }],
  },
];

const statusBadgeVariant: {
  [key: string]: "default" | "secondary" | "outline" | "destructive";
} = {
  Submitted: "outline",
  "In Progress": "secondary",
  Resolved: "default",
  Pending: "destructive",
};

export default function MyReportsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadPendingReports = () => {
      const pending = JSON.parse(localStorage.getItem('pending_reports') || '[]');
      setReports(prevReports => [...pending.filter((p: Report) => !prevReports.some(r => r.id === p.id)), ...prevReports]);
    };

    const syncReports = async () => {
      if (navigator.onLine) {
        const pending: Report[] = JSON.parse(localStorage.getItem('pending_reports') || '[]');
        if (pending.length > 0) {
          setIsSyncing(true);
          toast({ title: "Syncing...", description: `Submitting ${pending.length} pending report(s).` });
          
          let successfulSyncs = 0;
          const remainingReports = [...pending];

          for (const report of pending) {
            const result = await submitReportAction({
              issueType: report.issueType,
              description: report.description,
              latitude: report.location.lat,
              longitude: report.location.lng,
              photoDataUri: report.photoURL,
            });

            if (result.success) {
              successfulSyncs++;
              const index = remainingReports.findIndex(r => r.id === report.id);
              if (index > -1) remainingReports.splice(index, 1);
            }
          }

          localStorage.setItem('pending_reports', JSON.stringify(remainingReports));
          if (successfulSyncs > 0) {
            toast({ title: "Sync Complete!", description: `${successfulSyncs} report(s) submitted successfully.` });
            // Refresh reports from local storage to update statuses
            setReports(prev => prev.filter(r => r.status !== 'Pending'));
             const currentPending = JSON.parse(localStorage.getItem('pending_reports') || '[]');
            setReports(prevReports => [...currentPending, ...mockReports]);
          }
          setIsSyncing(false);
        }
      }
    };
    
    loadPendingReports();
    syncReports();

  }, [toast, isAuthenticated]);

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
      <h1 className="text-4xl font-headline font-bold mb-8">{t('my_reports_title')}</h1>
      {reports.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Dialog key={report.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-xl transition-shadow flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="font-headline">
                          {report.issueType}
                        </CardTitle>
                        {isSyncing && report.status === 'Pending' && <Loader2 className="animate-spin text-primary" />}
                        {!isSyncing && report.status === 'Pending' && <WifiOff className="text-destructive" />}
                    </div>
                    <CardDescription>
                      {t('my_reports_submitted_on')}{" "}
                      {new Date(report.dateSubmitted).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {report.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Badge
                      variant={statusBadgeVariant[report.status] || "default"}
                    >
                      {t(`my_reports_status_${report.status.toLowerCase().replace(' ', '_')}`)}
                    </Badge>
                  </CardFooter>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl">
                    {report.issueType}
                  </DialogTitle>
                  <DialogDescription>
                    {t('my_reports_report_id')}: {report.id} | {t('my_reports_submitted')}:{" "}
                    {new Date(report.dateSubmitted).toLocaleDateString()}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{t('my_reports_photo')}</h4>
                      <Image
                        src={report.photoURL}
                        alt={`Photo of ${report.issueType}`}
                        width={400}
                        height={300}
                        className="rounded-lg object-cover aspect-[4/3]"
                        data-ai-hint={report.photoHint}
                      />
                    </div>
                    <div className="space-y-4">
                       <div>
                         <h4 className="font-semibold">{t('my_reports_status')}</h4>
                         <Badge
                           variant={statusBadgeVariant[report.status] || "default"}
                         >
                           {t(`my_reports_status_${report.status.toLowerCase().replace(' ', '_')}`)}
                         </Badge>
                       </div>
                      <div>
                        <h4 className="font-semibold">{t('my_reports_description')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">{t('my_reports_location')}</h4>
                        <p className="text-sm text-muted-foreground">
                          Lat: {report.location.lat.toFixed(5)}, Lng:{" "}
                          {report.location.lng.toFixed(5)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {report.timeline && (
                    <div>
                        <h4 className="font-semibold mb-4">{t('my_reports_status_timeline')}</h4>
                        <ul className="space-y-4">
                        {report.timeline.map((item, index) => (
                            <li key={index} className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                                <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                    index === (report.timeline && report.timeline.length - 1)
                                    ? "bg-primary"
                                    : "bg-muted"
                                }`}
                                >
                                <div className="w-2 h-2 rounded-full bg-card"></div>
                                </div>
                                {report.timeline && index < report.timeline.length - 1 && (
                                <div className="w-px h-8 bg-border"></div>
                                )}
                            </div>
                            <div>
                                <p className="font-medium">{t(`my_reports_status_${item.status.toLowerCase().replace(' ', '_')}`)}</p>
                                <p className="text-sm text-muted-foreground">
                                {new Date(item.date).toLocaleDateString()}
                                </p>
                            </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <h3 className="text-xl font-semibold">{t('my_reports_no_reports_title')}</h3>
            <p className="text-muted-foreground mt-2">
              {t('my_reports_no_reports_description')}
            </p>
            <Button asChild className="mt-6">
              <Link href="/report">{t('my_reports_report_first_button')}</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    