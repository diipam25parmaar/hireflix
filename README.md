# 🎥 HireFlix – Asynchronous Interview Platform (Laravel + React)

**HireFlix** is a full-stack clone-style implementation of an asynchronous interview platform:

- **Admins** create interviews and manage users.  
- **Candidates** receive interviews and submit recorded answers.  
- **Reviewers** view submissions, score answers, and leave feedback.

The stack is split into:

- `hireflix-backend` – **Laravel 10** REST API (MySQL, Sanctum, Bugsnag, seeders, role-based auth)  
- `hireflix-frontend` – **React 18** SPA (Redux Toolkit, React Router v6, TailwindCSS, Axios, Framer Motion)

This repo is designed as a **portfolio-quality project** that demonstrates real-world skills: authentication, role-based access control, file uploads, API design, seeding realistic data, and a modern frontend.

---

## 🧭 Table of Contents

- [Features](#-features)
  - [Admin Features](#admin-features)
  - [Reviewer Features](#reviewer-features)
  - [Candidate Features](#candidate-features)
  - [Technical Features](#technical-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Project Structure](#-architecture--project-structure)
- [Getting Started](#-getting-started)
  - [Backend Setup (Laravel API)](#1-backend-setup-laravel-api)
  - [Frontend Setup (React SPA)](#2-frontend-setup-react-spa)
- [Environment Variables](#-environment-variables)
- [Database & Seeders](#-database--seeders)
- [API Overview](#-api-overview)
- [Frontend Routes & Flows](#-frontend-routes--flows)
- [Testing](#-testing)
- [Potential Extensions](#-potential-extensions)
- [Author](#-author)

---

## ✨ Features

### Admin Features

- 👤 **User Management**
  - List all users (candidates + reviewers) via `/api/users`
  - Create, update (including role), and soft-delete users
  - Roles supported: `admin`, `candidate`, `reviewer`

- 📝 **Interview Management**
  - Create interviews with:
    - Title
    - Description
    - 3–5 questions per interview (seeded)
  - Update and soft-delete interviews
  - List all interviews and view a single interview’s details
  - Assign interviews to candidates (`interview_candidate` pivot table)

- 📊 **Overview of Assigned Interviews**
  - Admin-only route to view interviews with the list of assigned candidates

---

### Reviewer Features

- 🗂 **Review Dashboard**
  - See the list of available interviews
  - For a given interview, view all candidate submissions (including answers/questions)

- 🧮 **Answer Review**
  - For each answer:
    - View stored video path (or seeded video reference)
    - Assign a numeric score
    - Add a textual review comment
  - Review metadata stored:
    - `score`
    - `review_comment`
    - `reviewed_by` (reviewer user ID)

---

### Candidate Features

- 📬 **Assigned Interviews**
  - View all interviews assigned to the logged-in candidate (`/api/candidate/interviews`)
  - See interview details and all questions for a selected interview

- 📤 **Submit Answers**
  - Single submission per interview (backend blocks double submissions)
  - Submits per-question answers:
    - Backend is designed to accept **video files** per question
    - Answers are associated with a **Submission** and a **Question**

- 📁 **View Own Submission**
  - Candidate can fetch their own submission for a given interview

---

### Technical Features

- 🔐 **Authentication & Authorization**
  - Login / Register / Logout
  - Password reset flow via tokens (stored in `password_reset_tokens` table)
  - Token-based auth via **Laravel Sanctum**
  - Custom `RoleMiddleware` for route-level role enforcement (e.g. `role:admin`, `role:reviewer,admin`)

- 🗄️ **Data Modeling**
  - `User` (with role & soft deletes)
  - `Interview` (soft-deletable, created by admin)
  - `Question` (belongs to an interview)
  - `Submission` (one per candidate per interview)
  - `Answer` (per question per submission; supports file path, duration, score, comment)

- 📦 **Seeded, Realistic Demo Data**
  - Default seeder creates:
    - 5 admins, 5 candidates, 5 reviewers
    - 5 interviews per admin
    - 3–5 questions per interview
    - Submissions for each candidate across interviews
    - Answers per question with realistic metadata (duration, score, review comment, reviewer)

- 🧱 **Modern Frontend Architecture**
  - React 18 with functional components
  - Redux Toolkit slices:
    - `authSlice`, `adminSlice`, `candidateSlice`, `reviewerSlice`,
      `interviewsSlice`, `recordAnswersSlice`, `reviewSlice`, `manageUserSlice`, etc.
  - Global Axios instance with:
    - `baseURL` configurable via `REACT_APP_API_URL`
    - Automatic `Authorization: Bearer <token>` header from `localStorage`

- 🎨 **UI & UX**
  - TailwindCSS for layout and styling
  - Framer Motion animations (smooth transitions, micro-interactions)
  - Responsive dashboards for different roles (admin, reviewer, candidate)
  - React Router v6 for navigation and route protection

- 🐞 **Error Monitoring Ready**
  - Backend wired with **Bugsnag** (`bugsnag/bugsnag-laravel`)
  - Configurable via `BUGSNAG_API_KEY` in `.env`

---

## 🧱 Tech Stack

**Backend – `hireflix-backend`**

- PHP 8.1+
- Laravel 10
- Laravel Sanctum (API tokens)
- MySQL (or any DB supported by Laravel)
- Bugsnag (optional)
- Guzzle HTTP client
- Storage via Laravel’s filesystem (for answer video paths, etc.)

**Frontend – `hireflix-frontend`**

- React 18 (Create React App)
- Redux Toolkit
- React Router v6
- Axios
- TailwindCSS
- Framer Motion
- react-data-table-component
- Testing: React Testing Library & Jest setup

---

## 🏗 Architecture & Project Structure

```bash
HireFlix/
├── hireflix-backend/          # Laravel 10 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/API/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── InterviewController.php
│   │   │   │   ├── SubmissionController.php
│   │   │   │   ├── ReviewController.php
│   │   │   │   ├── CandidateController.php
│   │   │   │   └── UserManagementController.php
│   │   │   └── Middleware/RoleMiddleware.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Interview.php
│   │       ├── Question.php
│   │       ├── Submission.php
│   │       └── Answer.php
│   ├── config/
│   │   ├── app.php
│   │   ├── sanctum.php
│   │   └── bugsnag.php
│   ├── database/
│   │   ├── factories/         # User, Interview, Question, Submission, Answer factories
│   │   ├── migrations/        # DB schema for users, interviews, questions, etc.
│   │   └── seeders/DatabaseSeeder.php
│   ├── routes/api.php         # Auth, admin, reviewer, candidate APIs
│   ├── .env.example
│   ├── composer.json
│   └── package.json           # Vite dev tooling
│
└── hireflix-frontend/         # React SPA
    ├── src/
    │   ├── App.js             # Router + layout
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Header.js
    │   │   ├── Footer.js
    │   │   └── PrivateRoute.js
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CandidateDashboard.jsx
    │   │   ├── ReviewerDashboard.jsx
    │   │   ├── CreateInterview.jsx
    │   │   ├── AssignInterview.jsx
    │   │   ├── ManageUsers.jsx
    │   │   ├── RecordAnswers.jsx
    │   │   ├── ReviewAnswers.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   └── ResetPassword.jsx
    │   ├── store/             # Redux Toolkit slices & store
    │   └── utils/axios.js     # Axios instance with token interceptor
    ├── tailwind.config.js
    ├── package.json
    └── README.md