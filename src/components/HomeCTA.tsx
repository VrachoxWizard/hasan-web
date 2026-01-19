"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/PageTransition";
import { Link } from "@/i18n/navigation";
import { typography, spacing, components } from "@/lib/designTokens";
import { CONTACT } from "@/lib/constants";

export default function HomeCTA() {
  const t = useTranslations("home");

  return (
    <section
      className={`${spacing.section.medium} bg-gradient-to-br from-primary via-primary/90 to-accent/20`}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className={`${typography.h2} text-white mb-4`}>
              {t("cta.title")}
            </h2>
            <p className={`${typography.bodyLarge} text-white/90 mb-8`}>
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/kontakt">
                <Button
                  size="lg"
                  className={`${components.button.primary} min-w-[200px]`}
                >
                  {t("cta.contactUs")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href={`tel:${CONTACT.phoneRaw}`}>
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold min-w-[200px]"
                >
                  {CONTACT.phone}
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
