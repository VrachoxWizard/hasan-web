import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireCmsAuth } from "@/app/api/cms/_auth";
import {
  deleteVehicle,
  getVehicle,
  setVehicleExclusive,
  upsertVehicle,
} from "@/lib/cmsVehicleRepo";
import { VehicleUpsertSchema } from "@/lib/cmsVehicleSchema";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireCmsAuth(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const vehicle = await getVehicle(id);
    if (!vehicle)
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireCmsAuth(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = VehicleUpsertSchema.safeParse({ ...body, id });
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireCmsAuth(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (typeof body?.ekskluzivno !== "boolean") {
    return NextResponse.json({ error: "VALIDATION" }, { status: 400 });
  }

  try {
    await setVehicleExclusive(id, body.ekskluzivno);
    return NextResponse.json({ ok: true });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireCmsAuth(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    await deleteVehicle(id);
    return NextResponse.json({ ok: true });
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
