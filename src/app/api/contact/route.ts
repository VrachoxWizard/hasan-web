import { NextRequest, NextResponse } from "next/server";
import { getContactFormSchema } from "@/lib/schemas";

// Email configuration - in production, use environment variables
const RECIPIENT_EMAIL = process.env.CONTACT_EMAIL || "produktauto@gmail.com";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5; // max submissions per window
const rateLimitStore = new Map<string, number[]>();

interface ContactFormData {
  ime: string;
  email: string;
  telefon: string;
  budzet?: string;
  poruka: string;
  locale?: string;
  hp?: string;
}

const getClientIdentifier = (request: NextRequest) => {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const realIp = request.headers.get("x-real-ip");
  return forwarded || realIp || "anonymous";
};

const isRateLimited = (clientId: string) => {
  const now = Date.now();
  const recent =
    rateLimitStore
      .get(clientId)
      ?.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS) || [];

  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(clientId, recent);
    return true;
  }

  recent.push(now);
  rateLimitStore.set(clientId, recent);
  return false;
};

export async function POST(request: NextRequest) {
  const clientId = getClientIdentifier(request);

  if (isRateLimited(clientId)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Honeypot check
    if (body?.hp) {
      return NextResponse.json({ success: true });
    }

    const localeFromHeader = request.headers
      .get("accept-language")
      ?.split(",")[0]
      ?.split("-")[0];
    const locale =
      typeof body?.locale === "string" && body.locale
        ? body.locale
        : localeFromHeader || "hr";

    // Validate the form data
    const result = getContactFormSchema(locale).safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: result.error.issues,
        },
        { status: 400 }
      );
    }

    const formData: ContactFormData = { ...result.data, locale };

    // Format the email content
    const emailContent = formatEmailContent(formData);

    // Send email - integrate with your preferred email service
    const emailSent = await sendEmail({
      to: RECIPIENT_EMAIL,
      subject: `Nova poruka od ${formData.ime} - Produkt Auto`,
      html: emailContent,
      replyTo: formData.email,
    });

    if (!emailSent.success) {
      console.error("Failed to send email:", emailSent.error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send message. Please try again later.",
          debug:
            process.env.NODE_ENV === "development"
              ? emailSent.error
              : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

function formatEmailContent(data: ContactFormData): string {
  const budgetLabels: Record<string, string> = {
    "do-15000": "Do 15.000 EUR",
    "15000-25000": "15.000 - 25.000 EUR",
    "25000-40000": "25.000 - 40.000 EUR",
    "40000-60000": "40.000 - 60.000 EUR",
    "preko-60000": "Preko 60.000 EUR",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a365d; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1a365d; }
        .value { margin-top: 5px; }
        .message { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Nova poruka - Produkt Auto</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Ime i prezime:</div>
            <div class="value">${escapeHtml(data.ime)}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${escapeHtml(
              data.email
            )}">${escapeHtml(data.email)}</a></div>
          </div>
          ${
            data.telefon
              ? `
          <div class="field">
            <div class="label">Telefon:</div>
            <div class="value"><a href="tel:${escapeHtml(
              data.telefon
            )}">${escapeHtml(data.telefon)}</a></div>
          </div>
          `
              : ""
          }
          ${
            data.budzet
              ? `
          <div class="field">
            <div class="label">Budzet:</div>
            <div class="value">${budgetLabels[data.budzet] || data.budzet}</div>
          </div>
          `
              : ""
          }
          <div class="field">
            <div class="label">Poruka:</div>
            <div class="message">${escapeHtml(data.poruka).replace(
              /\n/g,
              "<br>"
            )}</div>
          </div>
          <div class="field">
            <div class="label">Jezik:</div>
            <div class="value">${escapeHtml(data.locale || "hr")}</div>
          </div>
        </div>
        <div class="footer">
          Ova poruka je poslana putem kontakt forme na produktauto.com
        </div>
      </div>
    </body>
    </html>
  `;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

interface EmailResult {
  success: boolean;
  error?: string;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo: string;
}

async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  // Check if we have email service configured
  const resendApiKey = process.env.RESEND_API_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const resendFrom =
    process.env.RESEND_FROM || "Produkt Auto <onboarding@resend.dev>";

  if (resendApiKey) {
    // Use Resend
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: options.to,
          subject: options.subject,
          html: options.html,
          reply_to: options.replyTo,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resend API Error:", errorText);
        return { success: false, error: `Resend API Error: ${errorText}` };
      }

      return { success: true };
    } catch (error) {
      console.error("Resend Fetch Error:", error);
      return { success: false, error: String(error) };
    }
  }

  if (sendgridApiKey) {
    // Use SendGrid
    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sendgridApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: options.to }] }],
          from: { email: "noreply@produktauto.com", name: "Produkt Auto" },
          reply_to: { email: options.replyTo },
          subject: options.subject,
          content: [{ type: "text/html", value: options.html }],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  // No email service configured - log to console in development or preview
  if (
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview"
  ) {
    console.log("=== EMAIL WOULD BE SENT (MOCKED) ===");
    console.log("To:", options.to);
    console.log("Subject:", options.subject);
    console.log("Reply-To:", options.replyTo);
    console.log("===========================");
    return { success: true };
  }

  // In production without email service, return error
  console.error(
    "CRITICAL: Email service not configured. RESEND_API_KEY or SENDGRID_API_KEY is missing."
  );
  return {
    success: false,
    error:
      "Email service not configured. Set RESEND_API_KEY or SENDGRID_API_KEY.",
  };
}
