# 🍕 Picantino
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![.NET](https://img.shields.io/badge/.NET-9-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-Database-CC2927?logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)

A full-stack restaurant website built for **Picantino**, an Italian pizzeria concept based in Plovdiv, Bulgaria. This is a personal portfolio project showcasing a marketing site and an ASP.NET Core API.

> Personal project, built independently for portfolio purposes — not a paid client engagement.

---

## Overview

Picantino is a two-part application:

- A **marketing/ordering-style frontend** — home page, full menu, brand story, and a location/reservation page — with a distinctive, hand-crafted visual identity (custom color system, typography, and micro-interactions).
- A **custom REST API backend** handling user accounts: registration with immediate sign-in, JWT-based login, and a forgot/reset password flow — all built from scratch rather than relying on a third-party auth provider.

The goal of this project was to practice building a complete product end to end: a polished, animated UI on top of a real, self-hosted authentication system with its own database, email delivery, and token handling.

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router 7
- Tailwind CSS + custom CSS-variable-based design system (color palette, typography scale, spacing/radius tokens)
- shadcn/ui component primitives (Radix UI under the hood)
- TanStack React Query
- React Hook Form
- Lucide icons

**Backend**
- ASP.NET Core Web API
- Entity Framework Core + SQL Server
- JWT bearer authentication
- BCrypt password hashing
- MailKit/MimeKit for password-reset emails

---

## Features

-  Custom design system - HSL-based CSS variables driving a cohesive brand palette, custom display/script typefaces, and consistent spacing/radius across every component
-  Full authentication flow - registration and JWT sign-in, plus "forgot password" email and secure reset-token flow
-  Responsive, animated UI - scroll-aware entrance animations, hover micro-interactions, and a mobile-friendly nav
-  Dynamic menu system - categorized menu data driving tabbed navigation and featured-dish highlights on the homepage
-  Reservation request form on the Visit page
-  Component-driven architecture - a reusable UI primitive layer (buttons, dialogs, forms, cards, etc.) shared across every page

---

## Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/images/       
│   ├── components/
│   │   ├── ui/                
│   │   ├── sections/         
│   │   ├── Layout.jsx, SiteHeader.jsx, SiteFooter.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx    
│   ├── pages/                 
│   ├── lib/                   
│   ├── data/menu.js
│   ├── App.jsx, main.jsx
│   └── index.css              
├── components.json
├── eslint.config.js
├── jsconfig.json
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js

backend/
├── Controllers/
│   └── AuthController.cs      
├── Models/                    
├── Dtos/
├── Services/                 
├── Data/
│   └── PizzeriaDbContext.cs
└── Program.cs
```

---

## Getting Started

### Frontend

```bash
cd frontend
npm ci
npm run dev       # http://localhost:5173
```

Copy `.env.example` to `.env.local` for local frontend configuration:

```
VITE_API_URL=http://localhost:5127/api
```

### Backend

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

Configure database, JWT, and SMTP secrets with .NET user-secrets or environment variables. Do not commit credentials. The checked-in development settings only contain a local trusted SQL Server connection.

Initialize local JWT settings once with .NET user-secrets (replace the key with a random value of at least 32 bytes):

```bash
cd backend
dotnet user-secrets set "Jwt:Key" "REPLACE_WITH_A_RANDOM_SECRET_OF_AT_LEAST_32_BYTES"
dotnet user-secrets set "Jwt:Issuer" "Picantino.Api"
dotnet user-secrets set "Jwt:Audience" "Picantino.Web"
```

### Docker local setup

Set `SQL_SA_PASSWORD` to a SQL Server-compliant password and `JWT_KEY` to a random key of at least 32 bytes in your shell, then run `docker compose up --build`. The API is available at `http://localhost:5127` and SQL Server at `localhost:1433`. Apply the existing EF migrations from the host using the API's connection string before exercising database endpoints. The Compose file persists SQL data in a named volume.

### Admin dashboard

Open `/admin` in the frontend after signing in with an account whose database `Role` is `Admin`. The dashboard can add, edit, and hide products; add, rename, and remove empty categories; and view orders and change their status. Hiding a product preserves historical order items. Both the page and its write endpoints require the Admin role. There is no built-in admin account or default password.

To grant your verified account access, first start and configure the API, then run this against your development database using your account's email:

```sql
UPDATE dbo.Users
SET Role = N'Admin'
WHERE Email = N'admin@example.com';
```

Sign out and sign in again after changing the role so the new JWT contains the Admin claim. GitHub Pages runs in mock demo mode and does not connect to the admin API, so the dashboard requires a frontend configured to use a real API and database.

---

## Roadmap

- [x] Cart UI and local cart persistence (checkout/API integration remains)
- [ ] Admin dashboard for menu/order management

The GitHub Pages build runs in portfolio demo mode. Account actions are simulated and the reservation form is a non-submitting preview. The public site does not connect to the ASP.NET API.

The browser stores JWT access tokens in `localStorage`, which is readable by JavaScript and therefore exposed if the site has an XSS flaw. The API limits access tokens to 15 minutes and the frontend clears them after a 401 response. A refresh-token flow and httpOnly-cookie deployment remain future security work.

---
