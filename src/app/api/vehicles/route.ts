import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getEkskluzivnaVozilaDb,
  getVozilaByIdsDb,
  getVozilaDb,
} from "@/lib/vozilaDb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
} as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const idsParam = searchParams.get("ids");
  const exclusiveParam = searchParams.get("exclusive");
  const limitParam = searchParams.get("limit");

  const limit = limitParam ? Number(limitParam) : undefined;
  const safeLimit =
    Number.isFinite(limit) && limit && limit > 0
      ? Math.min(limit, 50)
      : undefined;

  if (idsParam) {
    const ids = idsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const vozila = await getVozilaByIdsDb(ids);
    return NextResponse.json({ vozila }, { headers: noStoreHeaders });
  }

  if (exclusiveParam === "1" || exclusiveParam === "true") {
    const vozila = await getEkskluzivnaVozilaDb(safeLimit);
    return NextResponse.json({ vozila }, { headers: noStoreHeaders });
  }

  const vozila = await getVozilaDb();
  return NextResponse.json({
    vozila: safeLimit ? vozila.slice(0, safeLimit) : vozila,
  }, { headers: noStoreHeaders });
}
