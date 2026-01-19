import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyCmsSessionToken } from "@/lib/cmsAuth";

export function requireCmsAuth(request: NextRequest): NextResponse | null {
  const token = request.cookies.get("cms_session")?.value;
  const session = verifyCmsSessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  return null;
}
