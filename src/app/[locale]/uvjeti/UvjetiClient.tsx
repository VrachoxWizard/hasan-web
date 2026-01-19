"use client";

import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Scale,
  Car,
  CreditCard,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/PageTransition";
import { typography, spacing } from "@/lib/designTokens";
import { CONTACT, COMPANY } from "@/lib/constants";

const sections = [
  {
    icon: CheckCircle,
    title: "1. Opći uvjeti",
    content: `Korištenjem web stranice ${COMPANY.name} prihvaćate ove uvjete korištenja. Molimo vas da ih pažljivo pročitate prije korištenja naših usluga.

Zadržavamo pravo izmjene ovih uvjeta u bilo kojem trenutku. Nastavak korištenja stranice nakon izmjena smatra se prihvaćanjem novih uvjeta.`,
  },
  {
    icon: Car,
    title: "2. Informacije o vozilima",
    content: `Sve informacije o vozilima na našoj stranici pružene su u dobroj vjeri i prema našem najboljem znanju:

• Fotografije vozila su stvarne i aktualne
• Specifikacije i oprema su provjerene prije objave
• Cijene su izražene u eurima (€) i uključuju PDV
• Dostupnost vozila podložna je promjenama

Preporučujemo osobni pregled vozila prije kupnje.`,
  },
  {
    icon: CreditCard,
    title: "3. Cijene i plaćanje",
    content: `Sve cijene na stranici su informativnog karaktera:

• Konačna cijena utvrđuje se ugovorom o kupoprodaji
• Rezervacija vozila moguća je uz predujam
• Prihvaćamo plaćanje gotovinom, karticama i bankovnim transferom
• Mogućnost financiranja putem leasing kuća

Za detaljne informacije o plaćanju, kontaktirajte našu prodaju.`,
  },
  {
    icon: ShieldCheck,
    title: "4. Jamstvo i reklamacije",
    content: `Sva vozila prodana putem naše tvrtke dolaze sa:

• Provjerenom poviješću vozila
• Jamstvom na motor i mjenjač (ovisno o vozilu)
• Mogućnošću produljenog jamstva
• 14-dnevnim pravom na povrat za potrošače

Reklamacije se zaprimaju pisanim putem u zakonskom roku.`,
  },
  {
    icon: Scale,
    title: "5. Ograničenje odgovornosti",
    content: `${COMPANY.name} ne odgovara za:

• Tipografske greške na stranici
• Privremenu nedostupnost stranice
• Štetu nastalu korištenjem informacija sa stranice
• Odluke donesene na temelju informacija na stranici

Trudimo se održavati točnost svih informacija, ali preporučujemo provjeru prije kupnje.`,
  },
  {
    icon: AlertCircle,
    title: "6. Zabranjena korištenja",
    content: `Zabranjeno je:

• Kopiranje sadržaja bez dopuštenja
• Korištenje sadržaja u komercijalne svrhe
• Automatsko prikupljanje podataka (scraping)
• Bilo kakva aktivnost koja može oštetiti stranicu ili poslovanje

Kršenje ovih pravila može rezultirati pravnim postupkom.`,
  },
];

export default function UvjetiClient() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=80')",
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
                <FileText className="w-10 h-10 text-accent" />
              </motion.div>
              <h1 className={`${typography.h1} text-white mb-4 drop-shadow-lg`}>
                Uvjeti korištenja
              </h1>
              <p
                className={`${typography.bodyLarge} text-white/90 drop-shadow-md`}
              >
                Pravila i uvjeti korištenja naše web stranice i usluga. Molimo
                pročitajte pažljivo prije korištenja.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Content Section */}
      <section className={`${spacing.section.medium} bg-background`}>
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ovi uvjeti korištenja uređuju vaš odnos s {COMPANY.name} d.o.o.
              prilikom korištenja naše web stranice i usluga. Korištenjem naših
              usluga, suglasni ste s ovim uvjetima.
            </p>
          </motion.div>

          <StaggerContainer className="space-y-6">
            {sections.map((section) => (
              <StaggerItem key={section.title}>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden border-border/50 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-2 bg-gradient-to-b from-accent to-accent/60" />
                        <div className="flex-1 p-6 md:p-8">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                              <section.icon className="w-6 h-6 text-accent" />
                            </div>
                            <div className="flex-1">
                              <h2
                                className={`${typography.h4} text-foreground mb-3`}
                              >
                                {section.title}
                              </h2>
                              <div className="text-muted-foreground whitespace-pre-line leading-relaxed text-sm">
                                {section.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-border/50">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-8 h-8 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`${typography.h4} text-foreground mb-2`}>
                      Trebate pomoć?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Ako imate bilo kakvih pitanja o ovim uvjetima korištenja,
                      slobodno nas kontaktirajte.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <a
                        href={`tel:${CONTACT.phoneRaw}`}
                        className="text-accent font-semibold hover:underline"
                      >
                        {CONTACT.phone}
                      </a>
                      <span className="hidden sm:inline text-muted-foreground">
                        |
                      </span>
                      <a
                        href={`mailto:${CONTACT.email}`}
                        className="text-accent font-semibold hover:underline"
                      >
                        {CONTACT.email}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Last Updated & Version */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Verzija 1.0 | Zadnje ažuriranje: Prosinac 2025.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
