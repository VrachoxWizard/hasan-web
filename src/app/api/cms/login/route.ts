import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createCmsSessionToken } from "@/lib/cmsAuth";
import fs from "node:fs";
import path from "node:path";

function readEnvLocalCmsCreds(): { username?: string; password?: string } {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (!fs.existsSync(envPath)) return {};

    const content = fs.readFileSync(envPath, "utf8");
    const result: Record<string, string> = {};

    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;

      const eq = line.indexOf("=");
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      result[key] = value;
    }

    return {
      username: result.CMS_ADMIN_USERNAME,
      password: result.CMS_ADMIN_PASSWORD,
    };
  } catch {
    return {};
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const usernameRaw = body?.username;
  const passwordRaw = body?.password;

  let expectedUser = process.env.CMS_ADMIN_USERNAME;
  let expectedPass = process.env.CMS_ADMIN_PASSWORD;

  if (process.env.NODE_ENV !== "production") {
    const local = readEnvLocalCmsCreds();
    if (local.username && local.password) {
      expectedUser = local.username;
      expectedPass = local.password;
    }
  }

  if (!expectedUser || !expectedPass) {
    return NextResponse.json(
      { error: "CMS credentials are not configured" },
      { status: 500 }
    );
  }

  const stripInvisible = (value: string) =>
    value
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/\p{Cf}/gu, "");

  const normalizeUsername = (value: unknown) =>
    stripInvisible(String(value ?? "")).trim().toLowerCase();

  const normalizePassword = (value: unknown) =>
    stripInvisible(String(value ?? "")).trim();

  const username = normalizeUsername(usernameRaw);
  const password = normalizePassword(passwordRaw);
  const expectedUsername = normalizeUsername(expectedUser);
  const expectedPassword = normalizePassword(expectedPass);

  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json({ error: "Neispravni podaci" }, { status: 401 });
  }

  const token = createCmsSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set("cms_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
