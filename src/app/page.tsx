
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FilePlus2, ListChecks, CheckCircle2, Bell, Wrench, Droplets, Siren, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const {t} = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();


  const notices = [
    {
      icon: Wrench,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      titleKey: "notice_maintenance_title",
      dateKey: "notice_maintenance_date",
      contentKey: "notice_maintenance_content",
    },
    {
      icon: Droplets,
      iconColor: "text-red-500",
       bgColor: "bg-red-50",
      titleKey: "notice_water_title",
      dateKey: "notice_water_date",
      contentKey: "notice_water_content",
    },
    {
      icon: Siren,
       iconColor: "text-yellow-500",
       bgColor: "bg-yellow-50",
      titleKey: "notice_health_title",
      dateKey: "notice_health_date",
      contentKey: "notice_health_content",
    },
    {
      icon: Bell,
       iconColor: "text-green-500",
       bgColor: "bg-green-50",
      titleKey: "notice_community_title",
      dateKey: "notice_community_date",
      contentKey: "notice_community_content",
    },
  ];

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
    <div className="space-y-16">
       <section className="mt-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center bg-gradient-to-br from-orange-100 to-white">
            <CardHeader>
              <Avatar className="mx-auto h-40 w-40 mb-2 border-2 border-white shadow-lg">
                <AvatarImage
                  src="https://www.imageshine.in/uploads/gallery/Narendra_Modi_PNG.png"
                  alt="Narendra Modi"
                />
                <AvatarFallback>NM</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline text-lg">
                Narendra Modi
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="text-center bg-gradient-to-br from-blue-100 to-white">
            <CardHeader>
              <Avatar className="mx-auto h-40 w-40 mb-2 border-2 border-white shadow-lg">
                <AvatarImage
                  src="https://feeds.abplive.com/onecms/images/uploaded-images/2024/02/01/85535b82feab6e1da45a13597b2479ef1706780518118159_original.jpg?impolicy=abp_cdn&imwidth=200"
                  alt="Hemant Soren"
                  data-ai-hint="official portrait"
                />
                <AvatarFallback>HS</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline text-lg">
                Hemant Soren
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="text-center bg-gradient-to-br from-gray-100 to-white">
            <CardHeader>
              <Avatar className="mx-auto h-40 w-40 mb-2 border-2 border-white shadow-lg">
                <AvatarImage
                  src="https://img.freepik.com/free-photo/portrait-expressive-young-man-wearing-formal-suit_273609-6942.jpg?semt=ais_hybrid&w=740"
                  alt="Mayor"
                  data-ai-hint="official portrait"
                />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline text-lg">{t('report_mayor_name')}</CardTitle>
            </CardHeader>
          </Card>
        </div>
        <Card className="bg-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <Quote className="h-12 w-12 text-green-700 flex-shrink-0" />
              <div>
                <h4 className="font-headline font-semibold text-green-900 text-lg">
                  {t('report_message_title')}
                </h4>
                <p className="text-green-800 font-medium mt-1">
                  {t('report_message_content')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="text-center py-16 md:py-24 rounded-lg bg-green-800">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-white">
          {t('home_title_1')} <span className="text-green-300">{t('home_title_2')}</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-green-200">
          {t('home_subtitle')}
        </p>
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg animate-pulse-blue"
          >
            <Link href="/report">{t('home_report_button')}</Link>
          </Button>
        </div>
      </section>

      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline font-bold">
            {t('home_notifications_title')}
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            {t('home_notifications_subtitle')}
          </p>
        </div>
        <div className="space-y-6 max-w-4xl mx-auto">
          {notices.map((notice, index) => {
            const Icon = notice.icon;
            return (
              <div key={index} className="relative">
                <Card className={notice.bgColor}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow">
                        <CardTitle className="font-headline text-xl">
                          {t(notice.titleKey)}
                        </CardTitle>
                        <CardDescription className="text-sm pt-1">
                          {t("notice_posted_on", { date: t(notice.dateKey) })}
                        </CardDescription>
                      </div>
                      <div className={`p-3 ${notice.bgColor} rounded-full`}>
                        <Icon className={`h-6 w-6 ${notice.iconColor}`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{t(notice.contentKey)}</p>
                  </CardContent>
                </Card>
                 <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4">
                   <span className="relative inline-flex rounded-full h-12 w-12 bg-red-600 items-center justify-center">
                     <span className={cn(
                        "text-yellow-500 font-bold text-base transform -rotate-12",
                        index % 2 === 0 ? "animate-pulse-yellow" : "animate-pulse-yellow-delay"
                      )}>New</span>
                   </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>


      <section>
        <h2 className="text-3xl font-headline font-bold text-center mb-10">
          {t('home_how_it_works_title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                <FilePlus2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-headline mt-4">
                {t('home_step1_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('home_step1_description')}
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                <ListChecks className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-headline mt-4">
                {t('home_step2_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('home_step2_description')}
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-headline mt-4">
                {t('home_step3_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('home_step3_description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-12 items-center py-16">
        <div>
          <h2 className="text-3xl font-headline font-bold mb-4">
            {t('home_partnership_title')}
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            {t('home_partnership_description')}
          </p>
          <Button asChild className="bg-green-800 text-white hover:bg-green-700 animate-pulse-green">
            <Link href="/our-work">{t('home_our_work_button')}</Link>
          </Button>
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://i.pinimg.com/originals/0d/a7/51/0da751465d1a73044d77cfeec484eaec.jpg"
            alt="City street view"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
            data-ai-hint="city street"
          />
        </div>
      </section>
    </div>
  );
}
