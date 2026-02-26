/**
 * Produkt Auto Contact Information
 * Single source of truth for all contact details
 */

export const CONTACT = {
  phone: "+385 99 166 3776",
  phoneRaw: "+385991663776",
  email: "produktauto@gmail.com",
  address: {
    street: "Ulica Milana Prpića 120",
    city: "Oroslavje",
    postalCode: "49243",
    country: "Hrvatska",
    full: "Ulica Milana Prpića 120, 49243 Oroslavje, Hrvatska",
    vat: "HR88152951682",
  },
  whatsapp: {
    number: "385991663776",
    url: "https://wa.me/385991663776",
    messageUrl: (message: string) =>
      `https://wa.me/385991663776?text=${encodeURIComponent(message)}`,
  },
  social: {
    facebook: "https://facebook.com/produktauto",
    instagram: "https://instagram.com/produktauto",
    youtube: "https://youtube.com/@produktauto",
  },
  maps: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2775.5!2d15.9408!3d45.9167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4765cf00000000%3A0x0!2sUlica%20Milana%20Prpi%C4%87a%20120%2C%2049243%20Oroslavje!5e0!3m2!1shr!2shr!4v1701874800000!5m2!1shr!2shr",
    directionsUrl:
      "https://maps.google.com/?q=Ulica+Milana+Prpica+120+Oroslavje",
  },
  geo: {
    latitude: 45.9167,
    longitude: 15.9408,
  },
} as const;

export const WORKING_HOURS = {
  weekdays: { open: "09:00", close: "17:00", label: "Ponedjeljak - Petak" },
  saturday: { open: "09:00", close: "17:00", label: "Subota" },
  sunday: { closed: true, label: "Nedjelja" },
} as const;

export const COMPANY = {
  name: "Produkt Auto",
  legalName: "Produkt Auto j.d.o.o.",
  tagline: "Vaš pouzdani partner za kvalitetna vozila",
  description:
    "Ako vam je dosta neizvjesnosti i sumnji kod kupnje rabljenog vozila – dobrodošli ste kod nas. Nudimo samo provjerena, temeljito pregledana vozila s transparentnom dokumentacijom i realnim cijenama.",
  founded: 2014,
} as const;
