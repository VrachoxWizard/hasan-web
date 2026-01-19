import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireCmsAuth } from "@/app/api/cms/_auth";
import { listVehicles, upsertVehicle } from "@/lib/cmsVehicleRepo";
import { VehicleUpsertSchema } from "@/lib/cmsVehicleSchema";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const unauthorized = requireCmsAuth(request);
  if (unauthorized) return unauthorized;

  try {
    const data = await listVehicles();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "CMS_DB_UNAVAILABLE",
        message:
          "CMS baza nije dostupna. Na Vercelu SQLite datoteka (file:./data/app.db) ne radi. Koristi hosted Postgres (npr. Neon/Supabase) i postavi DATABASE_URL u Vercel Environment Variables (Production).",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = requireCmsAuth(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = VehicleUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const vehicle = await upsertVehicle(parsed.data);
    return NextResponse.json({ vehicle });
  } catch (error) {
    return NextResponse.json(
      {
        error: "CMS_DB_UNAVAILABLE",
        message:
          "CMS baza nije dostupna. Provjeri DATABASE_URL u Vercelu (Production).",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 503 }
    );
  }
}
