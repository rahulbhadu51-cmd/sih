
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function IssuesCoveredPage() {
  const { t } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();

  const issueCategories = [
    {
      key: "cleanliness",
      emoji: "🗑️",
      items: [
        "issues_covered_cleanliness_item1",
        "issues_covered_cleanliness_item2",
        "issues_covered_cleanliness_item3",
        "issues_covered_cleanliness_item4",
        "issues_covered_cleanliness_item5",
      ],
    },
    {
      key: "water",
      emoji: "💧",
      items: [
        "issues_covered_water_item1",
        "issues_covered_water_item2",
        "issues_covered_water_item3",
        "issues_covered_water_item4",
        "issues_covered_water_item5",
      ],
    },
    {
      key: "roads",
      emoji: "🛣️",
      items: [
        "issues_covered_roads_item1",
        "issues_covered_roads_item2",
        "issues_covered_roads_item3",
        "issues_covered_roads_item4",
        "issues_covered_roads_item5",
      ],
    },
    {
      key: "environment",
      emoji: "🌳",
      items: [
        "issues_covered_environment_item1",
        "issues_covered_environment_item2",
        "issues_covered_environment_item3",
        "issues_covered_environment_item4",
      ],
    },
    {
      key: "health",
      emoji: "🏥",
      items: [
        "issues_covered_health_item1",
        "issues_covered_health_item2",
        "issues_covered_health_item3",
        "issues_covered_health_item4",
      ],
    },
    {
      key: "admin",
      emoji: "🏛️",
      items: [
        "issues_covered_admin_item1",
        "issues_covered_admin_item2",
        "issues_covered_admin_item3",
        "issues_covered_admin_item4",
      ],
    },
    {
      key: "urban",
      emoji: "🏠",
      items: [
        "issues_covered_urban_item1",
        "issues_covered_urban_item2",
        "issues_covered_urban_item3",
      ],
    },
    {
      key: "grievances",
      emoji: "📢",
      items: [
        "issues_covered_grievances_item1",
        "issues_covered_grievances_item2",
        "issues_covered_grievances_item3",
      ],
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
    <div>
      <h1 className="text-4xl font-headline font-bold mb-8">{t('issues_covered_title')}</h1>
      <p className="mb-12 text-lg text-muted-foreground">
        {t('issues_covered_subtitle')}
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issueCategories.map((category) => (
          <Card key={category.key} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                <span className="mr-2">{category.emoji}</span>
                {t(`issues_covered_${category.key}_title`)}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                {category.items.map((item) => (
                  <li key={item}>{t(item)}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

    