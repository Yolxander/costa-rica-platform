# Costa Rica Rental Hub

A community-driven vacation rental platform built to connect travelers directly with property hosts across Costa Rica. Unlike traditional booking sites (Airbnb, Booking.com), this platform charges no commission fees — instead, hosts pay a simple flat yearly subscription to list their property.

## 🎯 Goals

- Provide Costa Rica property owners with an affordable alternative to commission-heavy platforms
- Give travelers a seamless way to browse by popular regions (Guanacaste, Tamarindo, Manuel Antonio, etc.)
- Create a mobile-first, bilingual (English/Spanish) experience for international visitors and local hosts
- Build an admin system that scales, allowing easy listing approvals and subscription management

## ✨ Core Features

- **Regional Browsing** – Properties organized by Costa Rica's most popular destinations
- **Flat Yearly Fee System** – Hosts list properties with no hidden charges or commissions
- **Host Dashboard** – Upload photos, edit details, manage availability, view inquiries & analytics
- **Traveler Search & Filters** – Location, price range, amenities, bedrooms, etc.
- **Availability Calendar** – Hosts can block off dates; travelers see real-time availability
- **Direct Contact** – Inquiries routed directly to host (email, WhatsApp, or phone)
- **Admin Panel** – Manage property approvals, subscription renewals, and overall platform activity
- **Mobile-First Design** – Optimized for travelers searching on their phones
- **Bilingual Interface** – Fully accessible in English + Spanish

## 🚀 Tech Stack

This platform is built with modern web technologies:

- **Laravel 12** - Latest Laravel framework with modern PHP 8.2+ features
- **React 19** - Latest React with TypeScript support
- **Inertia.js** - Modern monolith approach with SPA-like experience
- **shadcn/ui** - Beautiful, accessible UI components built with Radix UI
- **Tailwind CSS 4** - Latest Tailwind CSS with modern utility classes
- **Laravel Fortify** - Complete authentication system
- **Two-Factor Authentication** - Built-in 2FA support
- **Dark/Light Mode** - System preference detection and manual toggle
- **TypeScript** - Full TypeScript support for both frontend and backend
- **Vite** - Lightning-fast build tool with HMR
- **ESLint + Prettier** - Code formatting and linting
- **MYSQL** - Ready-to-use database

## 📋 Prerequisites

- **PHP 8.2+**
- **Composer**
- **Node.js 18+**
- **npm** or **yarn**

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd costa-rica-rental-hub
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Install Node.js dependencies

```bash
npm install
```

### 4. Environment setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database (or configure your preferred database in .env)
touch database/database.sqlite
```

### 5. Run database migrations

```bash
php artisan migrate
```

### 6. Build assets for production (or use development mode)

**For production:**
```bash
npm run build
```

**For development (recommended):**
```bash
npm run dev
```

### 7. Start the development server

**Option 1: Start everything with one command**
```bash
composer run dev
```
This will start:
- Laravel server (http://127.0.0.1:8000)
- Vite dev server with HMR
- Queue worker
- Log monitoring

**Option 2: Start services individually**
```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server (for hot reloading)
npm run dev
```

## 🎯 Quick Start Commands

After cloning the project, run these commands in order:

```bash
# 1. Install dependencies
composer install
npm install

# 2. Setup environment
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate

# 3. Start development
composer run dev
```

Your application will be available at `http://127.0.0.1:8000`

## 🏗️ Project Structure

```
├── app/
│   ├── Http/Controllers/     # Laravel controllers
│   ├── Http/Middleware/      # Custom middleware
│   └── Models/              # Eloquent models
├── resources/
│   ├── js/
│   │   ├── components/      # React components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── pages/          # Inertia.js pages
│   │   ├── layouts/        # Page layouts
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   ├── css/               # Global styles
│   └── views/             # Blade templates
├── public/build/          # Built assets (after npm run build)
└── database/              # Migrations and seeders
```

## 🎨 UI Components

This platform includes a comprehensive set of shadcn/ui components:

- **Form Components**: Input, Select, Checkbox, Button, etc.
- **Layout Components**: Dialog, Sheet, Navigation Menu
- **Data Display**: Avatar, Badge, Card, Table
- **Feedback**: Alert, Toast, Progress
- **Navigation**: Breadcrumbs, Tabs, Accordion

All components are fully typed with TypeScript and support dark/light themes.

## 🔐 Authentication Features

- **User Registration & Login**
- **Email Verification**
- **Password Reset**
- **Two-Factor Authentication (2FA)**
- **Profile Management**
- **Secure Session Handling**

## 🎭 Theme System

- **System Preference Detection** - Automatically detects user's OS theme
- **Manual Toggle** - Users can override system preference
- **Persistent Settings** - Theme preference is saved per user
- **CSS Variables** - Easy customization of colors and spacing

## 📱 Responsive Design

- **Mobile-First Approach** - Optimized for all screen sizes
- **Tailwind CSS** - Utility-first CSS framework
- **Flexible Layouts** - Adaptive components that work on any device

## 🧪 Development Tools

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run types
```

### Testing
```bash
# Run PHP tests
php artisan test

# Run with coverage
php artisan test --coverage
```

## 🚀 Deployment

### Production Build
```bash
# Build optimized assets
npm run build

# Cache Laravel config
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment Variables
Ensure these are set in production:
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://your-domain.com`
- Database credentials
- Mail configuration (if using email features)

## 🔧 Customization

### Adding New shadcn/ui Components
```bash
npx shadcn@latest add [component-name]
```

### Creating New Pages
1. Create React component in `resources/js/pages/`
2. Add route in `routes/web.php`
3. Return Inertia response in controller

### Styling
- Global styles: `resources/css/app.css`
- Component styles: Use Tailwind classes
- Custom CSS variables: Defined in `app.css`

## 📚 Tech Stack Details

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🆘 Troubleshooting

### Common Issues

**Vite manifest not found**
```bash
npm run build
```

**Permission issues on Linux/Mac**
```bash
chmod -R 755 storage bootstrap/cache
```

**Database connection issues**
- Ensure database file exists: `touch database/database.sqlite`
- Check `.env` database configuration

**Node modules issues**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Happy coding! 🎉

For questions or support, please open an issue in the repository.
