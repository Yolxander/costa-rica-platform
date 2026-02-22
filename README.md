# Costa Rica Rental Hub

A community-driven vacation rental platform built to connect travelers directly with property hosts across Costa Rica. Unlike traditional booking sites (Airbnb, Booking.com), this platform charges no commission fees -- instead, hosts pay a simple flat yearly subscription to list their property.

## Goals

- Provide Costa Rica property owners with an affordable alternative to commission-heavy platforms
- Give travelers a seamless way to browse by popular regions (Guanacaste, Tamarindo, Manuel Antonio, etc.)
- Create a mobile-first, bilingual (English/Spanish) experience for international visitors and local hosts
- Build an admin system that scales, allowing easy listing approvals and subscription management

## Core Features

### Public / Traveler Experience

- **Airbnb-style Home Page** -- Search bar, category filter pills, and a responsive property card grid
- **Listing Detail Page** -- Image gallery, property info, amenities, house rules, and a sticky inquiry sidebar
- **Direct Inquiry System** -- Travelers send inquiries directly to hosts with check-in/out dates, guest count, and a message
- **Save Listings** -- Authenticated users can heart/save properties; saved state persists across pages
- **User Account Page** -- Sidebar-navigated page with Profile editing, Inquiry history, and Saved Listings sections
- **Login / Register** -- Generic auth pages with post-login redirect back to the page the user came from

### Host Dashboard

- **Dashboard Overview** -- Property stats, views, inquiry counts, and booking summaries
- **Listings Management** -- Add, edit, and manage property listings with images, pricing, and availability
- **Calendar** -- Manage property availability and bookings
- **Inquiries** -- View and respond to traveler inquiries
- **Property Details** -- Deep-dive analytics and recent activity per property

### Admin Panel

- **Admin Dashboard** -- Platform-wide metrics, property approvals, host management, site analytics
- **Host Management** -- View hosts, subscription status, and property counts
- **Property Approvals** -- Review and approve/decline new property submissions
- **Subscription & Billing** -- Track yearly host subscriptions and renewals
- **Content Management** -- Manage platform content
- **Analytics & Reports** -- Site traffic, inquiry volume, and revenue charts

### Authentication & Security

- **Role-based Access** -- Admin, host, and regular user roles with separate dashboards
- **Two-Factor Authentication (2FA)** -- Optional TOTP-based 2FA via Laravel Fortify
- **Separate Admin Login** -- Dedicated `/admin/login` route for admin users
- **Email Verification** and **Password Reset** flows

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Laravel | 12.x | Backend framework |
| React | 19.x | Frontend library |
| TypeScript | 5.x | Type safety |
| Inertia.js | 2.x | SPA-like routing |
| Tailwind CSS | 4.x | Styling |
| Vite | 7.x | Build tool |
| Laravel Fortify | 1.x | Authentication |
| shadcn/ui | Latest | UI components |
| Radix UI | Latest | Accessible primitives |
| MySQL | 8.x | Database |

## Prerequisites

- **PHP 8.2+**
- **Composer**
- **Node.js 18+**
- **npm**

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd costa-rica-platform
```

### 2. Install dependencies

```bash
composer install
npm install
```

### 3. Environment setup

```bash
cp .env.example .env
php artisan key:generate
```

Configure your database credentials in `.env` (MySQL by default, or use SQLite for local dev).

### 4. Run database migrations

```bash
php artisan migrate
```

### 5. Start development

**All-in-one:**
```bash
composer run dev
```

This starts the Laravel server (`http://127.0.0.1:8000`), Vite dev server with HMR, queue worker, and log monitoring.

**Or start services individually:**
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

## Quick Start

```bash
composer install && npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
composer run dev
```

Your application will be available at `http://127.0.0.1:8000`.

## Project Structure

```
app/
  Http/
    Controllers/
      Auth/                     # Login, register, password reset
      Admin/Auth/               # Admin-specific authentication
      Settings/                 # Profile, password, 2FA controllers
    Middleware/                  # HandleInertiaRequests, admin guard
  Models/
    User.php                    # Roles, savedListings, sentInquiries
    Property.php                # Listings with images, pricing, amenities
    Inquiry.php                 # Traveler inquiries linked to properties & users
    HostSubscription.php        # Yearly host subscriptions
    SiteAnalytic.php            # Platform analytics data

resources/js/
  pages/
    welcome.tsx                 # Public home page (Airbnb-style)
    listing-detail.tsx          # Public listing detail + inquiry form
    account.tsx                 # Traveler account (profile, inquiries, saved)
    dashboard.tsx               # Host dashboard
    listings.tsx                # Host listings management
    calendar.tsx                # Host calendar
    inquiries.tsx               # Host inquiry management
    auth/                       # Login, register, password reset pages
    settings/                   # Host/admin profile, password, appearance, 2FA
    admin/                      # Admin dashboard and management pages
  components/
    ui/                         # shadcn/ui components
  layouts/                      # AppLayout, SettingsLayout, AuthLayout

routes/
  web.php                       # All route definitions
  auth.php                      # Authentication routes
  settings.php                  # Settings routes (profile, password, 2FA)

database/migrations/            # All migration files
```

## Key Routes

| Route | Auth | Description |
|-------|------|-------------|
| `GET /` | No | Home page with property search and grid |
| `GET /listing/{id}` | No | Property detail page |
| `POST /listing/{id}/inquire` | No | Submit inquiry to host |
| `POST /listing/{id}/save` | Yes | Toggle save/unsave a listing |
| `GET /account` | Yes | Traveler account page |
| `GET /dashboard` | Yes | Host dashboard |
| `GET /listings` | Yes | Host listings management |
| `GET /admin/dashboard` | Admin | Admin dashboard |
| `GET /settings/profile` | Yes | Host/admin profile settings |

## Development Tools

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run types

# PHP tests
php artisan test
```

## Deployment

```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Set in production `.env`:
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://your-domain.com`
- Database and mail credentials

## Customization

**Add a shadcn/ui component:**
```bash
npx shadcn@latest add [component-name]
```

**Create a new page:**
1. Create a React component in `resources/js/pages/`
2. Add a route in `routes/web.php`
3. Return an Inertia response from the route or controller

**Styling:**
- Global styles and CSS variables: `resources/css/app.css`
- Component styles: Tailwind utility classes
- Dark mode: Automatic via CSS variable system

## Troubleshooting

**Vite manifest not found** -- Run `npm run build`.

**Permission issues (Linux/Mac)** -- `chmod -R 755 storage bootstrap/cache`.

**Database connection issues** -- Check `.env` database configuration. For SQLite: `touch database/database.sqlite`.

**Node modules issues** -- `rm -rf node_modules package-lock.json && npm install`.

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
