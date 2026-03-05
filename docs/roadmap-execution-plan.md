# Costa Rica Rental Hub — Product Roadmap Execution Plan

> Aligned to the three-phase roadmap. Phase 1 focuses on the next 6 priority features to reach product-market fit with 10-50 early hosts in ~8 weeks.

The platform evolves through **three phases**: Phase 1 (Host Growth MVP), Phase 2 (Direct Booking Platform), Phase 3 (Host Ecosystem). This plan focuses on **Phase 1 execution** — the next 6 features that unlock host growth and position the platform as **the growth layer for hosts** (not competing with Airbnb/Guesty directly).

**Timeline:** Target ~8 weeks of development to launch Phase 1 MVP and impress early hosts.

---

## Current State Snapshot

| Feature       | Status   | Notes                                                                                             |
| ------------- | -------- | ------------------------------------------------------------------------------------------------- |
| Property CRUD | Partial  | Airbnb import only; Add/Edit modals exist (UI) but no backend; No delete; Images = JSON URLs only |
| Calendar      | UI only  | Month/week/year views, `DateAvailabilityModal` — no backend persistence, `events` = `[]`          |
| Inquiry flow  | Complete | `POST /listing/{id}/inquire` creates inquiry; no email to host                                    |
| Guest CRM     | Basic    | Derived from inquiries; no tags, notes, guest history view                                        |
| Marketing     | None     | `docs/marketing-page.md` spec exists; no implementation                                           |

**Stack:** Laravel 12, React 19, Inertia.js, Tailwind, shadcn. Mail: `HostAccessCodeMail` pattern available.

---

## Phase 1 — Next 6 Features (Implementation Order)

### 1. Property CRUD (Create, Edit, Delete, Image Upload)

**Goal:** Hosts can manage properties without Airbnb import.

**Backend:** New routes `POST /properties`, `PUT /properties/{id}`, `DELETE /properties/{id}`; `PropertyController`; image upload via Laravel Storage; reuse property schema and validation.

**Frontend:** Wire Add/Edit modals to API; image upload component; delete button with confirmation.

---

### 2. Availability Calendar (Backend)

**Goal:** Persist availability and blocked dates for vacancy marketing in Phase 2.

**Database:** `availability` table — `property_id`, `date`, `status` (available/blocked/maintenance/pending-inquiry), `reason`.

**Backend:** `GET /calendar?property_id=X`, `POST /calendar/availability`, `DELETE /calendar/availability/{id}`; `CalendarController`.

**Frontend:** Replace sample data in `calendar.tsx` with Inertia props; wire save/remove handlers.

---

### 3. Email Notifications for Inquiries

**Goal:** Host receives email when traveler submits inquiry. Two templates: new inquiry, inquiry response.

**Implementation:**
- **New inquiry:** `NewInquiryMail` — sent to host after `Inquiry::create()` (queued)
- **Inquiry response:** `InquiryResponseMail` — host → traveler via platform (reply-to set to host)

---

### 4. Host Messaging Reply (Email + WhatsApp Link)

**Goal:** Hosts can reply without full in-app chat.

**Implementation:** Reply UI with `mailto:traveler_email?subject=...` and `https://wa.me/PHONE` (if phone exists). No backend required.

---

### 5. Guest CRM Upgrades (Guest History, Tags, Notes)

**Goal:** Rich guest profiles for segmentation and campaigns.

**Database:** `guest_tags`, `guest_notes` (or pivot); key by `(user_id, traveler_email)`.

**Backend:** `GET /crm/guests/{email}`, `POST /crm/guests/{email}/notes`, `PATCH /crm/guests/{email}/tags`.

**Frontend:** Guest detail drawer with inquiry history, stays, tags, notes.

---

### 6. Inquiry Recovery Campaigns

**Goal:** Hosts email guests who inquired but didn’t book.

**Database:** `email_campaigns`, `email_unsubscribes`.

**Segments:** Didn’t book, Booked before, By property. Respect unsubscribes.

**Backend:** Campaign CRUD, segment preview, send. Laravel Mail + queue.

**Frontend:** `/marketing` page, create campaign flow (audience → compose → review/send).

---

### 7. Social Caption Generator

**Goal:** Hosts select property photos and get captions + hashtags.

**Implementation:** `/marketing` Social tab; image picker; template-based captions + Costa Rica hashtags; copy-to-clipboard.

---

## Phase 1 Growth Engine — Full Scope (Roadmap Items 5–9)

The **next 6 features** (1–6 above) are the immediate build. The full Phase 1 growth engine also includes:

- **7. Repeat Guest Campaigns** — Guest stayed last year → send return campaign. Uses "Booked before" segment (same as inquiry recovery). Build after inquiry recovery.
- **8. Review Marketing Engine** — Convert reviews into email testimonials, social posts, website highlights. Requires review data (not in schema); defer.
- **9. Social Caption Generator** — Covered in item 7 above.

---

## Phase 2 — Direct Booking Platform (4–12 months, Out of Scope)

- Booking system (bookings table, confirmation, guest history)
- Stripe Connect (payments, payouts)
- Direct booking pages (e.g. book.yourvilla.com)
- Vacancy marketing engine (empty dates → campaigns)
- Guest lifetime value tracking

**Success metric:** 500+ hosts, $1M+ booking volume.

---

## Phase 3 — Host Ecosystem (1–3 years, Out of Scope)

- Host referral program
- Traveler discovery marketplace
- SEO content engine
- Host growth analytics
- Integration marketplace (smart locks, cleaning, pricing, tours)

**Vision:** Costa Rica Rental Hub becomes the growth infrastructure for independent hosts — not just a PMS.

---

## Recommended Build Order

1. Property CRUD
2. Calendar backend
3. Inquiry email notifications
4. Host messaging reply
5. Guest CRM upgrades
6. Inquiry recovery campaigns
7. Social caption generator

---

## Success Metrics (Phase 1)

- 20+ hosts onboarded
- 100+ inquiries
- Repeat bookings generated via marketing tools (recovery + repeat campaigns)

**Product-market fit signal:** Hosts generate bookings using the marketing tools.
