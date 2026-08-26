# 🍕 Picantino
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![.NET](https://img.shields.io/badge/.NET-9-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-Database-CC2927?logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![License](https://img.shields.io/badge/License-Portfolio%20Project-lightgrey)](#license)

A full-stack restaurant website built for **Picantino**, a Italian pizzeria concept based in Plovdiv, Bulgaria. This is a personal portfolio project showcasing a complete, production-style web application - from a custom-designed marketing site to a self-built authentication system backed by a real API.

> Personal project, built independently for portfolio purposes — not a paid client engagement.

---

## Overview

Picantino is a two-part application:

- A **marketing/ordering-style frontend** — home page, full menu, brand story, and a location/reservation page — with a distinctive, hand-crafted visual identity (custom color system, typography, and micro-interactions).
- A **custom REST API backend** handling user accounts: registration with email OTP verification, JWT-based login, and a full forgot/reset password flow — all built from scratch rather than relying on a third-party auth provider.

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
- MailKit/MimeKit for transactional email (OTP verification codes, password reset links)

---

## Features

-  Custom design system - HSL-based CSS variables driving a cohesive brand palette, custom display/script typefaces, and consistent spacing/radius across every component
-  Full authentication flow - registration with email OTP verification, JWT login, "forgot password" email + secure reset token flow
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
npm install
npm run dev       # http://localhost:5173
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

### Backend

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

Configure your connection string, JWT settings, and SMTP credentials in `appsettings.Development.json`.

---

## Roadmap

- [ ] Online ordering & cart
- [ ] Admin dashboard for menu/order management

---
