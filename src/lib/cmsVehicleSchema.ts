import { z } from "zod";

const GorivoSchema = z.enum(["benzin", "dizel", "hibrid", "elektricni"]);
const MjenjacSchema = z.enum(["rucni", "automatski"]);

export const VehicleImageInputSchema = z.object({
  url: z.string().min(1),
  alt: z.string().optional(),
});

export const VehicleUpsertSchema = z.object({
  id: z.string().min(1).optional(),
  naziv: z.string().min(1),
  marka: z.string().min(1),
  model: z.string().min(1),
  godina: z.number().int().min(1900).max(2100),
  cijena: z.number().int().min(0),
  staracijena: z.number().int().min(0).optional().nullable(),
  kilometraza: z.number().int().min(0),
  gorivo: GorivoSchema,
  mjenjac: MjenjacSchema,
  snaga: z.number().int().min(0),
  boja: z.string().min(1),
  opis: z.string().default(""),
  karakteristike: z.array(z.string()).default([]),
  istaknuto: z.boolean().default(false),
  ekskluzivno: z.boolean().default(false),
  slike: z.array(VehicleImageInputSchema).min(1),
});

export const ExclusiveOrderSchema = z.object({
  exclusiveIdsInOrder: z.array(z.string().min(1)),
});

export type VehicleUpsertInput = z.infer<typeof VehicleUpsertSchema>;
