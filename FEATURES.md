# Costa Rica Rental Hub — Feature Status

> Last updated: March 2, 2026

This document tracks every feature in the platform, organized by completion status: **completed**, **partially built** (needs finishing), and **not yet built** (planned).

---

## Completed Features

These features are fully functional with backend logic, database support, and a working frontend UI.

### Authentication & Security

- **Host Registration** — Custom registration flow at `/host/register`. Creates user with `role=host`, sends an access code via email, and redirects to login. (`HostRegisteredUserController`)
- **Host Access Code Verification** — After registering, hosts verify an emailed access code at `/host/verify-access-code` before gaining full access. (`HostVerifyAccessCodeController`)
- **Login / Logout** — Standard email + password authentication via Laravel Fortify. (`AuthenticatedSessionController`)
- **Email Verification** — Users must verify their email before accessing authenticated routes. Full verify-email prompt, resend, and verification link flow.
- **Password Reset** — Forgot password + reset password flow with token-based email links.
- **Two-Factor Authentication (2FA)** — Full TOTP-based 2FA setup, challenge, and recovery codes via Laravel Fortify. Settings page at `/settings/two-factor`. UI includes setup modal, recovery codes display, enable/disable toggle.
- **Role-Based Access Control** — `User` model has `role` field (`admin`, `host`, `team_member`). Helper methods: `isAdmin()`, `isHost()`, `isTeamMember()`, `hasAdminAccess()`. Admin middleware guards `/admin/*` routes.
- **Separate Admin Login** — Dedicated `/admin/login` page and controller for admin users.

### Host Dashboard (Authenticated)

- **Dashboard Overview** — Displays key metrics (direct bookings, revenue processed, guest emails captured, money saved vs OTAs) and a property summary table. Data is pulled live from the database. Revenue is a placeholder until Stripe Connect is integrated.
- **Listings Management** — Lists all host properties with title, location, status, price, bedrooms, bathrooms, thumbnail, and last updated. Data sourced from `properties` table.
- **Inquiries Page** — Displays all inquiries sent to the host, pulled from the `inquiries` table with property relationship. Shows traveler name, email, phone, property, dates, guests, message, and status. Includes status update (`PATCH /inquiries/{id}`) to mark inquiries as `new`, `contacted`, `booked`, or `lost`. Falls back to sample data when no real inquiries exist.
- **Guest CRM** — Aggregates inquiries by traveler email to build a guest database. Shows name, email, phone, property, booking count, total spent, and last booking date. Supports filtering by property and CSV export. Data is derived from the `inquiries` table.
- **Property Details Page** — Deep-dive view for a single property showing all details (description, amenities, images, pricing, capacity, availability rules) plus performance metrics (views, inquiries, bookings, rating). Recent inquiries and upcoming bookings sections use hardcoded sample data.
- **Settings: Profile** — Edit name and email. Handles email re-verification when changed.
- **Settings: Password** — Change password with current password confirmation.
- **Settings: Appearance** — Theme/appearance preferences page.

### Public Pages

- **Landing Page** — Public homepage at `/` displaying host count from database. Marketing-oriented layout.
- **Listing Detail** — Public property page at `/listing/{id}` showing all property info (images, amenities, pricing, house rules, policies, host info). Data loaded from database with user relationship.
- **Listing Checkout / Inquiry Form** — Full inquiry submission flow at `/listing/{id}/checkout`. Travelers fill in name, email, phone, dates, guests, and message. Submits to `POST /listing/{id}/inquire` which validates and creates an `Inquiry` record. Shows confirmation screen on success. Pre-fills fields for logged-in users.
- **Pricing Page** — Static page showing three subscription tiers (Starter $29, Growth $59, Scale $99) with feature lists.
- **How It Works Page** — Static informational page explaining the platform.
- **Blog Page** — Static blog layout (placeholder content, no CMS backend).
- **Join Page** — CTA page encouraging hosts to sign up.

### Database & Models

- **Users** — Full migration with name, email, password, role, email verification, 2FA columns.
- **Properties** — Complete schema: name, type, status, approval_status, location, description, amenities (JSON), images (JSON), house_rules (JSON), policies (JSON), pricing fields, capacity fields, availability fields, performance counters. Belongs to User.
- **Inquiries** — Complete schema: property_id, user_id (host), traveler_user_id, traveler details, check-in/out dates, guests, message, status, sent_at. Belongs to Property, Host, and Traveler.
- **Guests** — Standalone table with name, email, phone, property_id, booking_count, total_spent, last_booking_date. Currently unused — CRM derives guest data from Inquiries instead.

---

## Partially Built Features (Needs Finishing)

These features have some code in place but are incomplete or rely on hardcoded/placeholder data.

### Calendar & Availability

- **What exists:** Full calendar UI at `/calendar` with month/week/year views, date availability modal, color-coded statuses (available, blocked, pending inquiry, maintenance). Frontend state management for adding/removing availability.
- **What's missing:** No backend persistence. Availability changes are only logged to `console.log()`. No API endpoints to save/load date availability or blocked dates. No database table for availability data. Events are passed as empty array `[]` from the backend. Sample data is hardcoded in the frontend.

### Property Details — Inquiries & Bookings

- **What exists:** Property details page loads real property data from the database.
- **What's missing:** The "Recent Inquiries" and "Upcoming Bookings" sections on the property details page use **hardcoded sample data** instead of querying the actual `inquiries` table for that property.

### Admin Dashboard

- **What exists:** Dashboard page at `/admin/dashboard` loads real data — total listings, active listings, pending approvals, recent inquiries count, property list with host names, and hosts list. Protected by admin middleware.
- **What's missing:** No approve/reject actions for properties (the `approval_status` column exists but there are no endpoints to change it). No interactive host management actions from the dashboard.

### Admin — Host Management

- **What exists:** Page shell at `/admin/hosts` with layout, sidebar, and header.
- **What's missing:** No data is passed from the backend. The page is an empty shell — no host list, no actions (suspend, contact, view details), no search/filter.

### Admin — Property Listings

- **What exists:** Page shell at `/admin/properties` with layout, sidebar, and header.
- **What's missing:** No data is passed from the backend. Empty shell — no property list, no approve/reject buttons, no filtering by status or host.

### Admin — Renewals & Billing

- **What exists:** Page shell at `/admin/billing` with layout, sidebar, and header.
- **What's missing:** No data, no subscription tracking, no billing logic. The `host_subscriptions` table was created then dropped in a later migration. No Stripe integration.

### Guest CRM — Total Spent

- **What exists:** CRM page displays guest data derived from inquiries, including a `total_spent` column.
- **What's missing:** `total_spent` is always `0` because there is no payment/booking system to track actual revenue per guest.

---

## Not Yet Built (Planned Features)

These features are referenced in the UI, pricing page, or codebase comments but have no implementation.

### Payments & Booking

- **Stripe Connect Integration** — Referenced in dashboard (`$revenueProcessed = 0; // Placeholder until Stripe Connect`) and pricing page (Growth tier: "Stripe Connect"). No Stripe package installed, no payment models, no checkout flow.
- **Direct Booking System** — The platform currently only supports inquiries. There is no actual booking confirmation, payment collection, or booking management. The `bookings` field on properties is a simple counter with no backing `bookings` table.

### Airbnb Import

- **What exists:** Fully functional two-step import flow at `/import-airbnb`. Hosts paste an Airbnb listing URL, the server-side `AirbnbScraper` service fetches the page and extracts listing data (name, description, images, location, capacity, amenities, rating) via JSON-LD structured data, Open Graph meta tags, and HTML text pattern fallbacks. A preview card lets hosts review and edit all fields before confirming. On confirm, the listing is saved as a new Property (status: Active, approval: pending) and the host is redirected to their listings page.
- **Backend:** `AirbnbImportController` (preview + store endpoints), `AirbnbScraper` service, URL validation enforcing `airbnb.com/rooms/{id}` format.
- **Tests:** 18 feature tests covering auth guards, validation, scraping strategies, property creation, and error handling.

### Property CRUD (Host-Side)

- **Add New Property** — There is no form or endpoint for hosts to create a new property listing. Properties can only exist if seeded or inserted directly into the database.
- **Edit Property** — No edit form or `PUT`/`PATCH` endpoint for updating property details (name, description, images, pricing, etc.).
- **Delete Property** — No delete action or endpoint.
- **Image Upload** — Property images are stored as JSON URLs. There is no file upload mechanism or storage integration (e.g., S3, local disk).

### Subscription & Billing System

- **Host Subscriptions** — The `host_subscriptions` table was created then dropped. No subscription model, no billing cycle, no payment gateway. The pricing page shows tiers but none are functional.
- **Subscription Gating** — No middleware or logic to restrict host features based on subscription tier.

### Search & Discovery

- **Property Search** — No search functionality. The landing page and listing pages have no search bar, filters, or category browsing.
- **Region Browsing** — The README mentions browsing by Costa Rica regions (Guanacaste, Tamarindo, Manuel Antonio) but this is not implemented.
- **Map View** — No map integration (Google Maps, Mapbox, etc.).

### Traveler Features

- **Save/Favorite Listings** — The `saved_listings` table was created then dropped. No save/unsave toggle on listing cards. The README references this but it's been removed.
- **Traveler Account Page** — No `/account` page for travelers to view their sent inquiries or saved listings. The README mentions this but it doesn't exist.
- **Traveler Registration** — Only host registration exists. There's no dedicated traveler signup flow (travelers can submit inquiries without an account).

### Communication

- **WhatsApp Integration** — Listed on the pricing page (Growth tier) but not implemented.
- **Host-Traveler Messaging** — No in-app messaging system. Hosts see inquiry messages but cannot reply through the platform.
- **Email Notifications for Inquiries** — When a traveler submits an inquiry, no email is sent to the host. The inquiry is only stored in the database.

### Internationalization

- **Bilingual Support (English/Spanish)** — Mentioned in the README goals but not implemented. No i18n framework, no translation files, no language toggle.

### Analytics & Reporting

- **Site Analytics** — The `site_analytics` table was created then dropped. No analytics tracking or reporting dashboard.
- **Property View Tracking** — `views_7d` and `views_30d` fields exist on properties but are never incremented. No view-tracking middleware or logic.
- **Revenue Reports** — No revenue tracking or reporting since there's no payment system.

### Content Management

- **Blog CMS** — The blog page exists but shows static placeholder content. No blog post model, no admin editor, no CRUD.
- **SEO & Meta Tags** — No dynamic meta tags, Open Graph tags, or sitemap generation.

---

## Summary Table

| Category | Completed | Needs Finishing | Not Built |
|----------|:---------:|:---------------:|:---------:|
| Auth & Security | 8 | 0 | 0 |
| Host Dashboard | 7 | 3 | 0 |
| Public Pages | 7 | 0 | 0 |
| Admin Panel | 1 | 4 | 0 |
| Property CRUD | 0 | 0 | 4 |
| Payments & Booking | 0 | 0 | 2 |
| Search & Discovery | 0 | 0 | 3 |
| Traveler Features | 0 | 0 | 3 |
| Communication | 0 | 0 | 3 |
| Airbnb Import | 0 | 0 | 1 |
| Subscriptions | 0 | 0 | 2 |
| i18n | 0 | 0 | 1 |
| Analytics | 0 | 0 | 3 |
| Content/SEO | 0 | 0 | 2 |
| **Total** | **23** | **7** | **24** |
