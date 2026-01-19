"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { CONTACT } from "@/lib/constants";

export default function FloatingWhatsApp() {
  const t = useTranslations("common.whatsapp");

  return (
    <motion.a
      href={CONTACT.whatsapp.messageUrl(t("defaultMessage"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("ariaLabel")}
      className="fixed bottom-24 right-6 z-40 sm:hidden"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <div className="w-14 h-14 bg-whatsapp rounded-full flex items-center justify-center shadow-lg">
          <MessageCircle className="w-7 h-7 text-whatsapp-foreground" />
        </div>
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-whatsapp rounded-full animate-ping opacity-20" />
      </div>
    </motion.a>
  );
}
