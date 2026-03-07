/**
 * HTML email templates for Brisa.
 * Use {{ params.PLACEHOLDER }} for substitution. Available placeholders:
 * - PROPERTY_NAME, PROPERTY_IMAGE, PROPERTY_LOCATION, PROPERTY_DESCRIPTION
 * - FIRST_NAME, HOST_NAME, LISTING_URL
 * - AVAILABLE_DATES, MAX_GUESTS, RATING
 */

export const EMAIL_TEMPLATES = {
    last_minute: {
        id: "last_minute",
        name: "Last-minute availability",
        subject: "Unexpected availability at {{ params.PROPERTY_NAME }} — reply to book",
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:'Segoe UI',sans-serif;background:#f5f5f5;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.08)">
  <div style="background:linear-gradient(135deg,#047857 0%,#059669 100%);padding:28px;text-align:center">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:600">Brisa</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,.9);font-size:14px">Last-minute availability</p>
  </div>
  <div style="padding:28px">
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151">Hi {{ params.FIRST_NAME }},</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4b5563">We have unexpected availability for your preferred dates at <strong>{{ params.PROPERTY_NAME }}</strong> in {{ params.PROPERTY_LOCATION }}.</p>
    {{ params.PROPERTY_IMAGE }}
    <p style="margin:20px 0 0;font-size:15px;line-height:1.6;color:#4b5563">Reply to this email to secure your booking — limited dates available.</p>
    <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#4b5563">
      <a href="{{ params.LISTING_URL }}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">View listing & book</a>
    </p>
    <p style="margin:28px 0 0;font-size:15px;color:#6b7280">Best,<br><strong>{{ params.HOST_NAME }}</strong></p>
  </div>
  <div style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#9ca3af">
    Brisa · Unsubscribe
  </div>
</div>
</body>
</html>`,
    },
    seasonal: {
        id: "seasonal",
        name: "Seasonal promo",
        subject: "Book 3+ nights at {{ params.PROPERTY_NAME }} — 10% off this season",
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:'Segoe UI',sans-serif;background:#f5f5f5;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.08)">
  <div style="background:linear-gradient(135deg,#b45309 0%,#d97706 100%);padding:28px;text-align:center">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:600">Seasonal Special</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,.95);font-size:18px;font-weight:600">10% off 3+ nights</p>
  </div>
  <div style="padding:28px">
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151">Hi {{ params.FIRST_NAME }},</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4b5563">Book 3+ nights at <strong>{{ params.PROPERTY_NAME }}</strong> in {{ params.PROPERTY_LOCATION }} this season and get <strong>10% off</strong>. Limited availability — reply to secure your dates.</p>
    {{ params.PROPERTY_IMAGE }}
    <p style="margin:20px 0 0;font-size:15px;line-height:1.6;color:#4b5563">Direct booking means no extra fees. We'd love to host you.</p>
    <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#4b5563">
      <a href="{{ params.LISTING_URL }}" style="display:inline-block;background:#d97706;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">Book now</a>
    </p>
    <p style="margin:28px 0 0;font-size:15px;color:#6b7280">Best,<br><strong>{{ params.HOST_NAME }}</strong></p>
  </div>
  <div style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#9ca3af">
    Brisa · Unsubscribe
  </div>
</div>
</body>
</html>`,
    },
    see_you_again: {
        id: "see_you_again",
        name: "We'd love to see you again",
        subject: "Your favorite spot in Costa Rica is waiting — {{ params.PROPERTY_NAME }}",
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:'Segoe UI',sans-serif;background:#f5f5f5;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.08)">
  <div style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);padding:28px;text-align:center">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:600">Welcome back</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,.9);font-size:14px">We'd love to host you again</p>
  </div>
  <div style="padding:28px">
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151">Hi {{ params.FIRST_NAME }},</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4b5563">Your favorite spot in Costa Rica is waiting. Book direct and save — we'd love to host you again at <strong>{{ params.PROPERTY_NAME }}</strong>.</p>
    {{ params.PROPERTY_IMAGE }}
    <p style="margin:20px 0 0;font-size:15px;line-height:1.6;color:#4b5563">No platform fees. Same warm hospitality.</p>
    <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#4b5563">
      <a href="{{ params.LISTING_URL }}" style="display:inline-block;background:#3b82f6;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">View {{ params.PROPERTY_NAME }}</a>
    </p>
    <p style="margin:28px 0 0;font-size:15px;color:#6b7280">Pura vida,<br><strong>{{ params.HOST_NAME }}</strong></p>
  </div>
  <div style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#9ca3af">
    Brisa · Unsubscribe
  </div>
</div>
</body>
</html>`,
    },
    blank: {
        id: "blank",
        name: "Blank",
        subject: "",
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:'Segoe UI',sans-serif;background:#fff;padding:24px">
<div style="max-width:560px;margin:0 auto">
  {{ params.CUSTOM_BODY }}
</div>
</body>
</html>`,
    },
} as const

export type EmailTemplateId = keyof typeof EMAIL_TEMPLATES

export interface EmailTemplateParams {
    PROPERTY_NAME?: string
    PROPERTY_IMAGE?: string
    PROPERTY_LOCATION?: string
    PROPERTY_DESCRIPTION?: string
    FIRST_NAME?: string
    HOST_NAME?: string
    LISTING_URL?: string
    AVAILABLE_DATES?: string
    MAX_GUESTS?: string
    RATING?: string
    CUSTOM_BODY?: string
}

/** Substitute {{ params.KEY }} placeholders in HTML or subject. */
export function substituteParams(
    template: string,
    params: EmailTemplateParams
): string {
    let result = template
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined) continue
        const pattern = new RegExp(
            `\\{\\{\\s*params\\.${key}\\s*\\}\\}`,
            "g"
        )
        result = result.replace(pattern, String(value))
    }
    return result
}

/** Build property image HTML for template. Returns empty string if no image. */
export function buildPropertyImageHtml(imageUrl: string | undefined): string {
    if (!imageUrl) return ""
    return `<p style="margin:0 0 20px"><img src="${imageUrl}" alt="Property" style="width:100%;max-width:480px;height:auto;border-radius:8px" /></p>`
}
