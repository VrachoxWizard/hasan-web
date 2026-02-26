"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Car,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT, WORKING_HOURS, COMPANY } from "@/lib/constants";

export default function Footer() {
  const t = useTranslations("common");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-primary via-primary to-primary/95 text-white relative pb-[env(safe-area-inset-bottom)]">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Car className="w-8 h-8 text-accent group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.5)] transition-all duration-300" />
              <span className="text-xl font-bold">
                Produkt <span className="text-accent">Auto</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              {COMPANY.description}
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href={CONTACT.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-accent hover:to-accent/70 hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={CONTACT.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-accent hover:to-accent/70 hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={CONTACT.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-accent hover:to-accent/70 hover:scale-110 transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("footer.navigation")}</h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/" as const, label: t("nav.home") },
                { href: "/vozila" as const, label: t("nav.allVehicles") },
                { href: "/o-nama" as const, label: t("nav.about") },
                { href: "/kontakt" as const, label: t("nav.contact") },
                { href: "/usporedi" as const, label: t("nav.compareVehicles") },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-1 text-white/70 hover:text-accent transition-colors text-sm"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-accent" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("footer.contact")}</h3>
            <div className="space-y-3">
              <a
                href={`tel:${CONTACT.phoneRaw}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm group"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                <span className="text-white/80 group-hover:text-white transition-colors">
                  {CONTACT.phone}
                </span>
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm group"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <span className="text-white/80 group-hover:text-white transition-colors">
                  {CONTACT.email}
                </span>
              </a>
              <a
                href={CONTACT.maps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm group"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors shrink-0">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <span className="text-white/80 group-hover:text-white transition-colors">
                  {CONTACT.address.street}
                  <br />
                  {CONTACT.address.postalCode} {CONTACT.address.city}
                  <br />
                  VAT: {CONTACT.address.vat}
                </span>
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t("footer.workingHours")}
            </h3>
            <div className="border-l-2 border-accent pl-4 bg-white/5 rounded-r-lg p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm text-white/80">
                  {t("footer.schedule")}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-white/70">
                    {t("workingHours.weekdays")}
                  </span>
                  <span className="text-white font-medium">
                    {WORKING_HOURS.weekdays.open} -{" "}
                    {WORKING_HOURS.weekdays.close}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-white/70">
                    {t("workingHours.saturday")}
                  </span>
                  <span className="text-white font-medium">
                    {WORKING_HOURS.saturday.open} -{" "}
                    {WORKING_HOURS.saturday.close}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-white/70">
                    {t("workingHours.sunday")}
                  </span>
                  <span className="text-accent font-medium">
                    {t("footer.closed")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar with separator */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-white/50">
              <p>
                © {new Date().getFullYear()} Produkt Auto.{" "}
                {t("footer.allRightsReserved")}
              </p>
              <span className="hidden sm:inline">•</span>
              <p className="flex items-center gap-1">
                {t("footer.madeInCroatia")}{" "}
                <span className="text-base">🇭🇷</span>
              </p>
            </div>
            <div className="flex gap-6 text-sm text-white/50">
              <Link
                href="/privatnost"
                className="hover:text-accent transition-colors"
              >
                {t("footer.privacy")}
              </Link>
              <Link
                href="/uvjeti"
                className="hover:text-accent transition-colors"
              >
                {t("footer.terms")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-xl bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
          aria-label={t("footer.backToTop")}
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
      )}
    </footer>
  );
}
