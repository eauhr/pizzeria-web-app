<div align="center">

```text
██████╗ ██╗ ██████╗█████╗ ███╗   ██╗████████╗██╗███╗   ██╗██████╗ 
██╔══██╗██║██╔════╝██╔══██╗████╗  ██║╚══██╔══╝██║████╗  ██║██╔══██╗
██████╔╝██║██║     ███████║██╔██╗ ██║   ██║   ██║██╔██╗ ██║██║  ██║
██╔═══╝ ██║██║     ██╔══██║██║╚██╗██║   ██║   ██║██║╚██╗██║██║  ██║
██║     ██║╚██████╗██║  ██║██║ ╚████║   ██║   ██║██║ ╚████║██████╔╝
╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═══╝╚═════╝ 
                       ITALIAN RESTAURANT

### Modern Full-Stack Restaurant Web Application

A portfolio project representing an Italian restaurant experience in Plovdiv, Bulgaria.

---

## Overview

**Picantino** is a full-stack restaurant website combining a responsive React frontend with a custom ASP.NET Core Web API.

The application provides a complete restaurant experience, including menu browsing, restaurant information, authentication, email verification, and database-backed user management.

> **Portfolio Project** — This is a self-directed, unpaid project created for learning and portfolio purposes.

---

## Features

*  Restaurant landing page
*  Restaurant story and history
*  Categorized food and wine menu
*  Image gallery
*  Customer reviews
*  Location and opening hours
*  Reservation request interface
*  User registration and login
*  Email OTP verification
*  Password reset
*  JWT authentication
*  Swagger / OpenAPI documentation
*  Responsive design

---

## Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| React 19 | User interface |
| Vite 8 | Development and build tooling |
| React Router 7 | Client-side routing |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| TanStack React Query | Data fetching and caching |
| React Hook Form | Form handling |
| Zod | Validation |
| Lucide | Icons |

### Backend

| Technology | Purpose |
| --- | --- |
| .NET 9 | Runtime |
| ASP.NET Core | REST API |
| Entity Framework Core | ORM |
| SQL Server | Database |
| JWT Bearer | Authentication |
| BCrypt | Password hashing |
| MailKit | Email delivery |
| Swagger / OpenAPI | API documentation |

---

## Architecture

```text
┌──────────────────────┐
│   React + Vite       │
│   Frontend           │
└──────────┬───────────┘
           │
           │ HTTP / JSON
           ▼
┌──────────────────────┐
│   ASP.NET Core       │
│   Web API            │
└──────────┬───────────┘
           │
           │ Entity Framework Core
           ▼
┌──────────────────────┐
│      SQL Server      │
│      Database        │
└──────────────────────┘

```

Authentication uses JWT tokens for protected API requests.

---

## Project Structure

```text
picantino/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── sections/
│       │   └── ui/
│       ├── contexts/
│       ├── data/
│       ├── lib/
│       ├── pages/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── backend/
│   ├── Controllers/
│   ├── Data/
│   ├── Dtos/
│   ├── Models/
│   ├── Services/
│   ├── Migrations/
│   ├── Program.cs
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   └── backend.csproj
│
└── README.md

```

---

## Getting Started

### Prerequisites

Make sure you have installed:

* **Node.js**
* **.NET 9 SDK**
* **SQL Server**
* **Git**

### 1. Clone the repository

```bash
git clone <repository-url>
cd picantino

```

### 2. Configure the backend

Update `backend/appsettings.Development.json` with your local SQL Server connection string, JWT configuration, and SMTP settings.

### 3. Set up the database

```bash
cd backend
dotnet restore
dotnet ef database update

```

### 4. Start the backend

```bash
dotnet run

```

The API URL and port will be displayed in the terminal. Swagger is available at: `http://localhost:<port>/swagger`

### 5. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev

```

The frontend will normally be available at: `http://localhost:5173`

---

## Authentication

The authentication system is implemented using JWT Bearer authentication.

* **Registration** — `POST /api/auth/register` (Creates a new account and initiates email verification)
* **Verify Email** — `POST /api/auth/verify-otp` (Verifies the account using the emailed OTP)
* **Login** — `POST /api/auth/login` (Authenticates the user and returns a JWT)
* **Current User** — `GET /api/auth/me` (Returns information about the authenticated user)
* **Password Reset** — `POST /api/auth/forgot-password` & `POST /api/auth/reset-password` (Handles recovery flow)

---


---

## Development

Run the two applications separately during development.

**Backend:**

```bash
cd backend
dotnet run

```

**Frontend:**

```bash
cd frontend
npm run dev

```

During development, Swagger can be used to inspect and test the API endpoints.

---

## Project Status

The core application is implemented, including:

* Restaurant website & responsive frontend
* Menu system
* Authentication, Email verification & Password recovery
* JWT authorization
* SQL Server integration & Entity Framework migrations
* Swagger documentation

**Future Roadmap:**

* Online ordering & Shopping cart
* Reservation management system
* Extended user profiles
* Administrative dashboard

---

## License

This project is an unpaid portfolio and educational project. It is not an official website or commissioned software for the restaurant.

```

```
