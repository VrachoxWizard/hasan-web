"use client";

import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/PageTransition";
import LazyMap from "@/components/LazyMap";
import { typography, spacing, components } from "@/lib/designTokens";
import { CONTACT, WORKING_HOURS } from "@/lib/constants";

export default function HomeMap() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <section className={spacing.section.medium}>
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className={`${typography.h2} text-foreground mb-4`}>
              {t("map.title")}
            </h2>
            <div
              className={`flex flex-col items-center justify-center gap-1 ${typography.body} text-muted-foreground`}
            >
              <div className="flex items-center gap-2">
                <MapPin className={`w-5 h-5 ${components.icon.accent}`} />
                <span>{CONTACT.address.full}</span>
              </div>
              <span className="text-sm">VAT: {CONTACT.address.vat}</span>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <FadeIn>
            <LazyMap
              src={CONTACT.maps.embedUrl}
              title={t("map.locationTitle")}
              className="rounded-2xl overflow-hidden shadow-lg border border-border h-full"
            />
          </FadeIn>

          <FadeIn>
            <Card className="h-full">
              <CardContent className="p-8">
                <h3 className={`${typography.h3} text-foreground mb-4`}>
                  Produkt Auto j.d.o.o.
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p className={typography.body}>
                    {t("map.companyDescription1")}
                  </p>
                  <p className={typography.body}>
                    {t("map.companyDescription2")}
                  </p>
                  <p className={typography.body}>
                    {t("map.companyDescription3")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground mb-1">
                        {t("map.workingHoursTitle")}
                      </p>
                      <p className="text-sm">
                        {tCommon("workingHours.weekdays")}:{" "}
                        {WORKING_HOURS.weekdays.open} -{" "}
                        {WORKING_HOURS.weekdays.close}
                      </p>
                      <p className="text-sm">
                        {tCommon("workingHours.sunday")}:{" "}
                        {tCommon("footer.closed")}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground mb-1">
                        {tCommon("footer.contact")}
                      </p>
                      <p className="text-sm">Tel: {CONTACT.phone}</p>
                      <p className="text-sm">Email: {CONTACT.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
