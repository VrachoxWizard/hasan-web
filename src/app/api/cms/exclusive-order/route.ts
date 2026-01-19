import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireCmsAuth } from "@/app/api/cms/_auth";
import { ExclusiveOrderSchema } from "@/lib/cmsVehicleSchema";
import { setExclusiveOrder } from "@/lib/cmsVehicleRepo";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const unauthorized = requireCmsAuth(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = ExclusiveOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await setExclusiveOrder(parsed.data.exclusiveIdsInOrder);
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
