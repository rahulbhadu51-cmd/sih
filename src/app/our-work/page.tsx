
"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryData = [
  {
    status: "Resolved",
    titleKey: "our_work_resolved_title",
    descKey: "our_work_resolved_desc",
    data: [
      { nameKey: "report_form_issue_cleanliness", value: 150, color: "#10B981" },
      { nameKey: "report_form_issue_water", value: 100, color: "#3B82F6" },
      { nameKey: "report_form_issue_roads", value: 80, color: "#F59E0B" },
      { nameKey: "report_form_issue_health", value: 50, color: "#EF4444" },
      { nameKey: "report_form_issue_other", value: 20, color: "#6B7280" },
    ],
  },
  {
    status: "In Progress",
    titleKey: "our_work_in_progress_title",
    descKey: "our_work_in_progress_desc",
    data: [
      { nameKey: "report_form_issue_cleanliness", value: 50, color: "#10B981" },
      { nameKey: "report_form_issue_water", value: 120, color: "#3B82F6" },
      { nameKey: "report_form_issue_roads", value: 90, color: "#F59E0B" },
      { nameKey: "report_form_issue_health", value: 30, color: "#EF4444" },
      { nameKey: "report_form_issue_other", value: 10, color: "#6B7280" },
    ],
  },
  {
    status: "Submitted",
    titleKey: "our_work_submitted_title",
    descKey: "our_work_submitted_desc",
    data: [
      { nameKey: "report_form_issue_cleanliness", value: 20, color: "#10B981" },
      { nameKey: "report_form_issue_water", value: 30, color: "#3B82F6" },
      { nameKey: "report_form_issue_roads", value: 100, color: "#F59E0B" },
      { nameKey: "report_form_issue_health", value: 40, color: "#EF4444" },
      { nameKey: "report_form_issue_other", value: 10, color: "#6B7280" },
    ],
  },
];

const mayorImage = "https://media.istockphoto.com/id/1477066614/photo/happy-business-woman-portrait-and-face-of-leadership-office-manager-and-motivation-in-canada.jpg?s=612x612&w=0&k=20&c=EhSJ1CyN3nlN5Hhvf_lV2C9oDBwJgy_ITYyR3QIpf5E=";
const newImageUrl = "https://media.gettyimages.com/id/475967799/photo/portrait-of-confident-businesswoman.jpg?s=612x612&w=0&k=20&c=etFluqNYYmE0wFi-DD8A-XCwBUpSY-qkVUC7J2QlSQ4=";

const officials = [
    {
      nameKey: "official_mayor_name",
      titleKey: "official_mayor_title",
      imageUrl: mayorImage,
      fallback: "MK",
      hint: "official portrait",
    },
    {
      nameKey: "official_commissioner_name",
      titleKey: "official_commissioner_title",
      imageUrl: newImageUrl,
      fallback: "MK",
      hint: "official portrait",
    },
    {
      nameKey: "official_deputy_mayor_name",
      titleKey: "official_deputy_mayor_title",
      imageUrl: newImageUrl,
      fallback: "SV",
      hint: "official portrait",
    },
    {
      nameKey: "official_engineer_name",
      titleKey: "official_engineer_title",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/50/Dwight_D._Eisenhower,_official_Presidential_portrait.jpg",
      fallback: "PS",
      hint: "official portrait",
    },
    {
      nameKey: "official_health_officer_name",
      titleKey: "official_health_officer_title",
      imageUrl: newImageUrl,
      fallback: "KK",
      hint: "official portrait",
    },
    {
      nameKey: "official_secretary_name",
      titleKey: "official_secretary_title",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/50/Dwight_D._Eisenhower,_official_Presidential_portrait.jpg",
      fallback: "RG",
      hint: "official portrait",
    },
  ];

const schemes = [
    {
      titleKey: "scheme_pmjay_title",
      descKey: "scheme_pmjay_desc",
      linkKey: "scheme_pmjay_link",
      href: "#",
    },
    {
      titleKey: "scheme_swa_title",
      descKey: "scheme_swa_desc",
      linkKey: "scheme_swa_link",
      href: "#",
    },
    {
      titleKey: "scheme_amrut_title",
      descKey: "scheme_amrut_desc",
      linkKey: "scheme_amrut_link",
      href: "#",
    },
     {
      titleKey: "scheme_pmay_title",
      descKey: "scheme_pmay_desc",
      linkKey: "scheme_pmay_link",
      href: "#",
    },
  ];


export default function OurWorkPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-16">
      <section>
        <div className="text-center">
          <h1 className="text-4xl font-headline font-bold mb-4">{t('our_work_title')}</h1>
          <p className="text-lg text-muted-foreground">{t('our_work_subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {categoryData.map((chart) => {
            const translatedData = chart.data.map(item => ({...item, name: t(item.nameKey)}));
            return (
              <Card key={chart.status} className="w-full">
                <CardHeader>
                  <CardTitle>{t(chart.titleKey)}</CardTitle>
                  <CardDescription>{t(chart.descKey)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={translatedData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {chart.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
      
      <section>
          <div className="text-center">
            <h1 className="text-4xl font-headline font-bold mb-4">
              {t("schemes_title")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("schemes_subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {schemes.map((scheme) => (
              <Card key={scheme.titleKey} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">
                    {t(scheme.titleKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{t(scheme.descKey)}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="link" className="p-0 h-auto text-primary">
                    <a href={scheme.href} target="_blank" rel="noopener noreferrer">
                      {t(scheme.linkKey)} <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
      </section>

      <section>
         <div className="text-center">
            <h1 className="text-4xl font-headline font-bold mb-4">
              {t("officials_title")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("officials_subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {officials.map((official) => (
              <Card
                key={official.nameKey}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-primary/20 shadow-md">
                    <AvatarImage
                      src={official.imageUrl}
                      alt={t(official.nameKey)}
                      data-ai-hint={official.hint}
                    />
                    <AvatarFallback>{official.fallback}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="font-headline text-xl">
                    {t(official.nameKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary font-semibold">{t(official.titleKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
      </section>

    </div>
  );
}
