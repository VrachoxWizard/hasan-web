"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GitCompare, Phone, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useUsporediStore } from "@/stores/usporediStore";
import { useFavoritiStore } from "@/stores/favoritiStore";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { CONTACT } from "@/lib/constants";

export default function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();

  const navLinks = [
    { href: "/" as const, label: t("nav.home") },
    { href: "/vozila" as const, label: t("nav.vehicles") },
    { href: "/kontakt" as const, label: t("nav.contact") },
    { href: "/o-nama" as const, label: t("nav.about") },
  ];
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const vozila = useUsporediStore((state) => state.vozila);
  const favoriti = useFavoritiStore((state) => state.favoriti);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const compareCount = vozila.length;
  const favoritiCount = favoriti.length;

  return (
    <>
      {/* Floating Logo - elegantly positioned overlapping header bottom */}
      <Link
        href="/"
        className="fixed top-2 left-4 md:left-6 z-[60] group"
        aria-label="Produkt Auto - Početna"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Logo container */}
          <div className="relative bg-white rounded-2xl p-3 md:p-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)] ring-2 ring-white/50 group-hover:ring-accent/60 group-hover:shadow-[0_12px_40px_rgba(96,165,250,0.4)] transition-all duration-300">
            <Image
              src="/logoweb.png"
              alt="Produkt Auto logo"
              width={100}
              height={100}
              className="object-contain w-20 h-20 md:w-[100px] md:h-[100px]"
              priority
            />
          </div>
        </motion.div>
      </Link>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-change-transform ${
          isScrolled
            ? "bg-white/95 dark:bg-primary/95 backdrop-blur-xl shadow-lg border-b border-border/30"
            : "bg-white/90 dark:bg-primary/90 backdrop-blur-xl border-b border-border/20"
        }`}
      >
        <div className="container mx-auto px-4">
          <nav
            className="flex items-center justify-between h-16 md:h-20"
            role="navigation"
            aria-label={t("header.mainNavigation")}
          >
            {/* Spacer for logo area */}
            <div className="w-28 md:w-32" />

            {/* Desktop Navigation - centered */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-all duration-200 rounded-lg px-4 py-2.5 ${
                    pathname === link.href
                      ? "text-white bg-accent"
                      : "text-foreground/80 hover:text-foreground hover:bg-accent/10 dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10"
                  } focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions: WhatsApp, Compare, Favorites, Theme */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* WhatsApp Button - Visible on all screens, icon only on mobile */}
              <a
                href={CONTACT.whatsapp.messageUrl(t("whatsapp.defaultMessage"))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-pointer"
                aria-label={t("header.contactViaWhatsApp")}
              >
                <Button
                  size="sm"
                  className="bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground gap-1.5 px-3 sm:px-4"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </Button>
              </a>

              {/* Compare Button */}
              <Link
                href="/usporedi"
                className="cursor-pointer"
                aria-label={`${t("nav.compare")}${
                  compareCount > 0 ? ` (${compareCount})` : ""
                }`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="relative border-accent/50 text-accent hover:bg-accent hover:text-white bg-background/50 dark:bg-transparent min-h-[40px] rounded-xl focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <GitCompare className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">{t("nav.compare")}</span>
                  <AnimatePresence>
                    {compareCount > 0 && (
                      <motion.div
                        key={compareCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.3, 1] }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Badge
                          variant="default"
                          className="h-5 w-5 p-0 flex items-center justify-center bg-accent text-white text-xs font-bold"
                          aria-hidden="true"
                        >
                          {compareCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>

              {/* Favorites Button - Improved accessibility */}
              <Link
                href="/favoriti"
                className="hidden sm:block cursor-pointer"
                aria-label={`${t("nav.favorites")}${
                  favoritiCount > 0 ? ` (${favoritiCount})` : ""
                }`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-foreground/60 hover:text-favorite hover:bg-accent/10 dark:text-white/80 dark:hover:text-favorite dark:hover:bg-white/10 min-w-[40px] min-h-[40px] rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favoritiCount > 0 ? "fill-favorite text-favorite" : ""
                    }`}
                    aria-hidden="true"
                  />
                  <AnimatePresence>
                    {favoritiCount > 0 && (
                      <motion.div
                        key={favoritiCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.3, 1] }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Badge
                          variant="default"
                          className="h-5 w-5 p-0 flex items-center justify-center bg-favorite text-favorite-foreground text-xs font-bold"
                          aria-hidden="true"
                        >
                          {favoritiCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>

              {/* Language Switcher */}
              <Suspense fallback={<div className="w-10 h-10" />}>
                <LanguageSwitcher />
              </Suspense>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground dark:text-white min-w-[44px] min-h-[44px] rounded-xl hover:bg-accent/10 dark:hover:bg-white/10"
                    aria-label="Otvori navigacijski izbornik"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-gradient-to-b from-primary via-primary to-primary/95 border-l border-accent/20 w-[85vw] max-w-[360px] p-0"
                >
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="relative px-6 pt-6 pb-4">
                      {/* Decorative accent line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/50 to-transparent" />

                      <div className="flex items-center justify-between">
                        <Link
                          href="/"
                          className="flex items-center gap-3 group"
                          onClick={() => setIsOpen(false)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="bg-white rounded-xl p-2 shadow-lg shadow-black/20"
                          >
                            <Image
                              src="/logoweb.png"
                              alt="Produkt Auto logo"
                              width={48}
                              height={48}
                              className="w-12 h-12 object-contain"
                            />
                          </motion.div>
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-white leading-tight">
                              Produkt <span className="text-accent">Auto</span>
                            </span>
                            <span className="text-xs text-white/50">
                              {t("header.premiumVehicles")}
                            </span>
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsOpen(false)}
                          className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl w-11 h-11 min-w-[44px] min-h-[44px]"
                          aria-label={t("header.closeMenu")}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Main Navigation */}
                    <nav className="flex-1 px-4 py-4 overflow-y-auto">
                      <div className="space-y-1">
                        {navLinks.map((link, index) => (
                          <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 + 0.1 }}
                          >
                            <Link
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className={`group flex items-center gap-4 px-4 py-4 rounded-xl font-medium transition-all duration-200 ${
                                pathname === link.href
                                  ? "bg-accent text-white shadow-lg shadow-accent/30"
                                  : "text-white/80 hover:bg-white/10 hover:text-white active:bg-white/15"
                              }`}
                            >
                              <span className="text-[15px]">{link.label}</span>
                              {pathname === link.href && (
                                <motion.div
                                  layoutId="mobile-nav-active"
                                  className="ml-auto w-2 h-2 rounded-full bg-white"
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                                />
                              )}
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      {/* Quick Actions Section */}
                      <div className="mt-6">
                        <p className="px-4 mb-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                          {t("header.quickAccess")}
                        </p>
                        <div className="space-y-1">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                          >
                            <Link
                              href="/usporedi"
                              onClick={() => setIsOpen(false)}
                              className="group flex items-center gap-4 px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 active:bg-white/15"
                            >
                              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                                <GitCompare className="w-5 h-5 text-accent" />
                              </div>
                              <div className="flex-1">
                                <span className="text-[15px] font-medium">
                                  {t("nav.compareVehicles")}
                                </span>
                                {compareCount > 0 && (
                                  <p className="text-xs text-white/50">
                                    {compareCount}{" "}
                                    {t("header.vehiclesSelected")}
                                  </p>
                                )}
                              </div>
                              {compareCount > 0 && (
                                <Badge className="bg-accent text-white h-7 min-w-[28px] px-2.5 text-sm font-bold">
                                  {compareCount}
                                </Badge>
                              )}
                            </Link>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Link
                              href="/favoriti"
                              onClick={() => setIsOpen(false)}
                              className="group flex items-center gap-4 px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 active:bg-white/15"
                            >
                              <div className="w-10 h-10 rounded-xl bg-favorite/20 flex items-center justify-center group-hover:bg-favorite/30 transition-colors">
                                <Heart
                                  className={`w-5 h-5 text-favorite ${
                                    favoritiCount > 0 ? "fill-current" : ""
                                  }`}
                                />
                              </div>
                              <div className="flex-1">
                                <span className="text-[15px] font-medium">
                                  {t("nav.favorites")}
                                </span>
                                {favoritiCount > 0 && (
                                  <p className="text-xs text-white/50">
                                    {favoritiCount} {t("header.saved")}
                                  </p>
                                )}
                              </div>
                              {favoritiCount > 0 && (
                                <Badge className="bg-favorite text-favorite-foreground h-7 min-w-[28px] px-2.5 text-sm font-bold">
                                  {favoritiCount}
                                </Badge>
                              )}
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    </nav>

                    {/* Contact Actions - Footer */}
                    <div className="px-4 pb-6 pt-4 border-t border-white/10 bg-black/20">
                      <p className="px-4 mb-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                        {t("footer.contact")}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <motion.a
                          href={`tel:${CONTACT.phoneRaw}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}
                          className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 active:bg-white/15 min-h-[72px]"
                        >
                          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-accent" />
                          </div>
                          <span className="text-xs font-medium text-white/70">
                            {t("header.call")}
                          </span>
                        </motion.a>

                        <motion.a
                          href={CONTACT.whatsapp.messageUrl(
                            t("whatsapp.defaultMessage")
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl bg-whatsapp/10 hover:bg-whatsapp/20 transition-all duration-200 active:bg-whatsapp/30 min-h-[72px]"
                        >
                          <div className="w-12 h-12 rounded-full bg-whatsapp/20 flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-whatsapp" />
                          </div>
                          <span className="text-xs font-medium text-whatsapp">
                            WhatsApp
                          </span>
                        </motion.a>
                      </div>

                      {/* Phone number display */}
                      <div className="mt-4 text-center">
                        <a
                          href={`tel:${CONTACT.phoneRaw}`}
                          className="text-sm text-white/50 hover:text-white/70 transition-colors"
                        >
                          {CONTACT.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
