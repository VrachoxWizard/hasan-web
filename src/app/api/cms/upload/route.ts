import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import path from "node:path";
import { promises as fs } from "node:fs";
import crypto from "node:crypto";
import { put } from "@vercel/blob";
import { requireCmsAuth } from "@/app/api/cms/_auth";

export const runtime = "nodejs";

function safeExt(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  if (!ext) return "";
  // Allow common image extensions only
  if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext)) return "";
  return ext;
}

export async function POST(request: NextRequest) {
  const unauthorized = requireCmsAuth(request);
  if (unauthorized) return unauthorized;

  const isVercel = !!process.env.VERCEL;
  const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

  // Vercel Serverless functions cannot persist writes to the project filesystem.
  // In production on Vercel we use Vercel Blob.
  if (isVercel && !hasBlob) {
    return NextResponse.json(
      {
        error: "CMS_UPLOAD_UNAVAILABLE",
        message:
          "Upload na Vercelu zahtijeva Vercel Blob. Dodaj BLOB_READ_WRITE_TOKEN u Vercel Environment Variables (Production).",
      },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((f) => f instanceof File) as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "Nema datoteka" }, { status: 400 });
  }

  const urls: string[] = [];

  for (const file of files) {
    const ext = safeExt(file.name);
    if (!ext) {
      return NextResponse.json(
        { error: `Nepodržan format: ${file.name}` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 10MB per file guard
    if (buffer.byteLength > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: `Datoteka prevelika: ${file.name}` },
        { status: 413 }
      );
    }

    const basename = `${crypto.randomUUID()}${ext}`;

    if (isVercel) {
      const blob = await put(`uploads/${basename}`, buffer, {
        access: "public",
        contentType: file.type || undefined,
        addRandomSuffix: false,
      });
      urls.push(blob.url);
    } else {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, basename);
      await fs.writeFile(filePath, buffer);
      urls.push(`/uploads/${basename}`);
    }
  }

  return NextResponse.json({ urls });
}
