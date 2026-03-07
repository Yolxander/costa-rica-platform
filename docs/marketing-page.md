# Marketing Page — Product Spec

> Brisa — Host marketing tools for email campaigns and social promotion.

**Route:** `/marketing` (Host Dashboard)

**Nav placement:** Under "Communication" — Inquiries | Guest CRM | **Marketing**

---

## Overview

A single **Marketing** page with tabs for **Email** (Phase 1) and **Social** (Phase 2 & 3). The page lets hosts re-engage past inquirers and guests, and promote properties on social media. Phase 1 focuses on email marketing to maximize ROI for vacation rentals.

---

# Phase 1: Email Marketing (Primary Focus)

Re-engage inquirers who didn’t book and nurture past guests for repeat stays. Email marketing has the strongest ROI for vacation rentals because:

- Travelers who inquired have already shown intent
- Past guests are 2–3x more likely to rebook than cold traffic
- Costa Rica travel is often repeat (same region, same host)
- Direct relationship = no OTA fees

---

## 1.1 Data Foundation

**Audience source:** Guest CRM, derived from `inquiries`.

| Field | Source |
|-------|--------|
| Name | `traveler_name` |
| Email | `traveler_email` |
| Phone | `traveler_phone` |
| Property | `property_id` / `property.name` |
| Inquiry status | `new`, `contacted`, `booked`, `lost` |
| Last inquiry date | `sent_at` |
| Check-in/out | `check_in`, `check_out` |

**Implications:**
- Only people who have submitted at least one inquiry are in the audience
- No separate “newsletter signup” list in Phase 1 (could add later)
- Must respect unsubscribe status (see Compliance below)

---

## 1.2 Audience Segmentation

Hosts need to target the right people. Suggested segments:

| Segment | Criteria | Use case |
|---------|----------|----------|
| **Didn’t book** | `status` in `new`, `contacted`, `lost` | Re-engage with availability, promo |
| **Booked before** | `status = booked` | Repeat stay, loyalty, referrals |
| **Recent inquirers** | `sent_at` in last 30/60/90 days | Fresh follow-up |
| **By property** | `property_id = X` | Property-specific offers |
| **All guests** | No filter | Broad announcements |

**Segment builder UI:**
- Dropdown or checkboxes for segment type
- Optional property filter (if multiple properties)
- Optional date range (e.g. “Inquired in last 90 days”)
- Live **recipient count** so the host sees audience size before sending

---

## 1.3 Campaign Create Flow

**Step 1 — Choose audience**
- Select segment (e.g. “Didn’t book, last 90 days”)
- Optionally filter by property
- Show recipient count; show warning if 0

**Step 2 — Compose email**
- **Subject line** (required)
- **Preview text** (optional, for inbox snippet)
- **Sender name** (default: host’s name from profile)
- **Reply-to** (default: host’s email)
- **Body** — rich text editor with:
  - Bold, italic, links
  - Images (optional — property photo or generic)
  - Personalization tokens: `{{first_name}}`, `{{property_name}}`, `{{host_name}}`
  - Mandatory unsubscribe link (handled by platform)

**Step 3 — Review & send**
- Preview desktop + mobile
- Test send to host’s own email
- Schedule (date + time) or **Send now**
- Confirmation modal before sending

---

## 1.4 Pre-built Email Templates

Ready-made templates reduce friction and improve quality:

| Template | Purpose | Suggested content |
|----------|---------|-------------------|
| **Last-minute availability** | Cancellation / open dates | “We have unexpected availability for [dates]. Reply if interested.” |
| **Seasonal promo** | Off-season or peak deals | “Book 3+ nights in [season] and get 10% off.” |
| **Thank you for inquiring** | Auto-follow-up (Phase 1.5) | “Thanks for your interest in [property]. Here’s more info and our availability.” |
| **We’d love to see you again** | Past guests | “Your favorite spot in [region] is waiting. Book direct and save.” |
| **Costa Rica travel tips** | Nurture / value | Short tips, local recommendations, link to property |
| **Blank** | Custom | Empty template for fully custom campaigns |

Templates include placeholders like `{{first_name}}`, `{{property_name}}`, `{{host_name}}`, `{{listing_url}}`.

---

## 1.5 Campaign Management

**Campaign list view**
- Tab/filter: **All** | **Sent** | **Scheduled** | **Drafts**
- Each row: Name, Segment, Recipients, Status, Sent/Scheduled date
- Actions: View, Duplicate, Edit (drafts only), Cancel (scheduled only)
- Create campaign button

**Campaign detail view (sent campaigns)**
- Subject, segment, sent date
- Opens / clicks (if ESP provides)
- Unsubscribes
- Link back to list

---

## 1.6 Email Delivery (Technical Options)

**Option A — Laravel Mail + external SMTP**
- Use Laravel’s mail system
- Host provides SMTP or use Resend/SendGrid
- No extra models; campaigns stored as `email_campaigns` + `email_campaign_recipients` or similar

**Option B — ESP API (Resend, Mailchimp, etc.)**
- Sync audience segments via API
- Send via ESP
- Track opens/clicks in ESP, display in app if API allows

**Recommendation for Phase 1:** Start with Laravel Mail + Resend or similar for simplicity. Add ESP integration later if needed for advanced analytics.

---

## 1.7 Compliance (GDPR / CAN-SPAM)

- **Unsubscribe link** in every email
- **Physical address** in footer (host or platform)
- Store `unsubscribed_at` per email address (new table or column on a guest/contact model)
- Exclude unsubscribed emails from all segments
- Optional: preference center (“Email me: All / Promos only / Never”)

---

## 1.8 Phase 1 User Flows (End-to-end)

**Flow A — Send “Didn’t book” re-engagement campaign**
1. Host → Marketing → Email tab
2. Clicks “Create campaign”
3. Chooses segment “Didn’t book, last 90 days”
4. Sees “23 recipients”
5. Selects template “Last-minute availability” or “Blank”
6. Edits subject: “Open dates at [Property Name] — reply to book”
7. Customizes body, adds dates or promo
8. Clicks “Preview” → sends test to self
9. Clicks “Schedule for tomorrow 10am” or “Send now”
10. Confirms → campaign queued/sent
11. Returns to list; campaign appears under “Sent” or “Scheduled”

**Flow B — Quick send to past guests**
1. Host → Marketing → Email
2. “Create campaign”
3. Segment “Booked before”
4. Template “We’d love to see you again”
5. Minimal edits, “Send now”
6. Confirms → done

---

## 1.9 Phase 1 Database Models (Suggested)

**`email_campaigns`**
- `id`, `user_id` (host)
- `name`, `subject`, `preview_text`, `body` (HTML)
- `segment_type`, `segment_config` (JSON)
- `recipient_count`
- `status`: `draft` | `scheduled` | `sent`
- `scheduled_at`, `sent_at`
- `template_id` (nullable, if using template table)
- `timestamps`

**`email_campaign_recipients`** (optional, for tracking)
- `email_campaign_id`, `traveler_email`
- `sent_at`, `opened_at`, `clicked_at`, `unsubscribed_at`

**`email_unsubscribes`**
- `user_id` (host), `email`
- `unsubscribed_at`
- Unique on `(user_id, email)`

---

## 1.10 Phase 1 UI Structure (Email Tab)

```
┌─────────────────────────────────────────────────────────────┐
│  Email Marketing                              [Create campaign] │
├─────────────────────────────────────────────────────────────┤
│  [All] [Sent] [Scheduled] [Drafts]                           │
├─────────────────────────────────────────────────────────────┤
│  Campaign Name    │ Segment           │ Recipients │ Status   │
│  Last-min promo   │ Didn't book 90d   │ 18         │ Sent     │
│  Summer deals     │ All guests        │ 42         │ Scheduled│
│  New draft        │ Booked before     │ 12         │ Draft    │
└─────────────────────────────────────────────────────────────┘
```

**Create campaign (multi-step)**
- Step 1: Audience (segment + property + count)
- Step 2: Compose (subject, sender, body, template picker)
- Step 3: Review (preview, test send, schedule/send)

---

# Phase 2: Social Content Tools (Brief)

Help hosts create social content from existing property data.

**Features:**
- **Image picker** — Select images from property galleries
- **Caption generator** — Auto-generate from property name, location, description
- **Hashtag suggestions** — Costa Rica–specific (e.g. #CostaRica, #Tamarindo, #PuraVida)
- **Copy to clipboard** — Caption + listing URL for manual posting
- **Post library** — Save drafts and “posted” items for reference

**Flow:**
1. Select property → load images + copy
2. Pick image(s), edit caption, add hashtags
3. Copy or save as draft
4. Post manually to Instagram/Facebook (no OAuth yet)

**Database:** `social_posts` (draft, caption, images JSON, property_id, user_id, posted_at)

---

# Phase 3: OAuth Posting & Analytics (Brief)

**OAuth posting:**
- Connect Instagram Business / Facebook Page
- Post directly from the app
- Requires Meta Developer app, OAuth flow, and API usage

**Richer analytics:**
- Email: open rate, click rate, unsubscribe rate per campaign
- Social: impressions, engagement (if Meta API provides)
- Marketing dashboard: campaigns sent, total emails, best-performing segments

---

# Implementation Priority

| Phase | Scope | Effort |
|-------|-------|--------|
| **Phase 1** | Email campaigns, segments, templates, send/schedule, compliance | High |
| **Phase 2** | Social content creator, image picker, copy-to-clipboard | Medium |
| **Phase 3** | OAuth, direct posting, analytics | High |

---

# Appendix: Segment Logic (Pseudocode)

```
segment "Didn't book":
  inquiries where host_id = current_host
    and status in ('new', 'contacted', 'lost')
    and sent_at >= (now - 90 days)
  distinct by traveler_email

segment "Booked before":
  inquiries where host_id = current_host and status = 'booked'
  distinct by traveler_email

segment "By property X":
  inquiries where host_id = current_host and property_id = X
  distinct by traveler_email
```

---

*Last updated: March 2026*
