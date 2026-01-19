"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/PageTransition";
import { typography, spacing } from "@/lib/designTokens";
import { CONTACT } from "@/lib/constants";

const sections = [
  {
    icon: Database,
    title: "Prikupljanje podataka",
    content: `Prikupljamo samo podatke koji su nužni za pružanje naših usluga. To uključuje:
    
• Ime i prezime
• Email adresa
• Broj telefona
• Podatke o vozilima koja vas zanimaju

Sve podatke prikupljamo isključivo uz vašu privolu i koristimo ih samo u svrhe za koje su namijenjeni.`,
  },
  {
    icon: Lock,
    title: "Zaštita podataka",
    content: `Vaši osobni podaci su zaštićeni najmodernijim sigurnosnim mjerama:

• SSL enkripcija svih komunikacija
• Sigurno pohranjivanje podataka
• Ograničen pristup podacima samo ovlaštenim osobama
• Redovite sigurnosne provjere i ažuriranja

Nikada ne dijelimo vaše podatke s trećim stranama bez vašeg izričitog pristanka.`,
  },
  {
    icon: Eye,
    title: "Korištenje kolačića",
    content: `Naša web stranica koristi kolačiće kako bi vam pružila najbolje korisničko iskustvo:

• Neophodni kolačići - za osnovne funkcije stranice
• Analitički kolačići - za razumijevanje kako koristite stranicu
• Funkcijski kolačići - za pamćenje vaših preferenci

Možete kontrolirati kolačiće putem postavki vašeg preglednika.`,
  },
  {
    icon: UserCheck,
    title: "Vaša prava",
    content: `Sukladno GDPR uredbi, imate sljedeća prava:

• Pravo pristupa vašim osobnim podacima
• Pravo na ispravak netočnih podataka
• Pravo na brisanje podataka ("pravo na zaborav")
• Pravo na ograničenje obrade
• Pravo na prenosivost podataka
• Pravo na prigovor

Za ostvarivanje bilo kojeg od ovih prava, kontaktirajte nas.`,
  },
];

export default function PrivatnostClient() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/80 to-primary/85" />

        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-2xl bg-accent/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6"
              >
                <Shield className="w-10 h-10 text-accent" />
              </motion.div>
              <h1 className={`${typography.h1} text-white mb-4 drop-shadow-lg`}>
                Politika privatnosti
              </h1>
              <p
                className={`${typography.bodyLarge} text-white/90 drop-shadow-md`}
              >
                Vaša privatnost nam je izuzetno važna. Ovdje možete saznati kako
                prikupljamo, koristimo i štitimo vaše osobne podatke.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Content Section */}
      <section className={`${spacing.section.medium} bg-background`}>
        <div className="container mx-auto px-4 max-w-5xl">
          <StaggerContainer className="space-y-8">
            {sections.map((section) => (
              <StaggerItem key={section.title}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-16 bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center p-4 md:p-0">
                          <section.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1 p-6 md:p-8">
                          <h2
                            className={`${typography.h4} text-foreground mb-4`}
                          >
                            {section.title}
                          </h2>
                          <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                            {section.content}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardContent className="p-8">
                <Mail className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className={`${typography.h4} text-foreground mb-2`}>
                  Imate pitanja o privatnosti?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Slobodno nas kontaktirajte za bilo kakva pitanja vezana uz
                  vaše osobne podatke.
                </p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-accent font-semibold hover:underline"
                >
                  {CONTACT.email}
                </a>
              </CardContent>
            </Card>
          </motion.div>

          {/* Last Updated */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Zadnje ažuriranje: Prosinac 2025.
          </p>
        </div>
      </section>
    </div>
  );
}
