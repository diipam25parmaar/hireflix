# HireFlix Backend

## Table of Contents
1. [Project Overview](#project-overview)
2. [Requirements](#requirements)
3. [Installation](#installation)
4. [Environment Setup](#environment-setup)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Seeder and Faker Setup](#seeder-and-faker-setup)
8. [Storage Link](#storage-link)
9. [API Endpoints](#api-endpoints)
10. [Guide Flow Route](#guide-flow-route)

---

## Project Overview
HireFlix is a Laravel-based backend project for managing online interviews, candidates, reviewers, submissions, and reviews.

It supports:
- User management (admin, candidate, reviewer)
- Interview management
- Question management
- Candidate submissions
- Review scoring and comments

All features are accessible via RESTful APIs.

---

## Requirements
- PHP >= 8.1
- Composer
- MySQL / MariaDB
- Node.js & NPM (optional, for frontend)

Laravel dependencies are defined in `composer.json`.

---

## Installation
1. Clone the repository:
```bash
git clone <your-repo-url>
cd hireflix-backend
```
2. Install Composer dependencies:
```bash
composer install
```
3. Copy `.env` file:
```bash
cp .env.example .env
```
4. Generate application key:
```bash
php artisan key:generate
```

---

## Environment Setup
Configure `.env` file:
```
APP_NAME=HireFlix
APP_ENV=local
APP_KEY=<generated>
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hireflix
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DRIVER=public
```
Other settings can remain default unless custom configuration is needed.

---

## Database Setup
Run migrations and seeders to create tables and fake data:
```bash
php artisan migrate:fresh --seed
```

**Notes:**
- This will drop all existing tables.
- Seeder will create:
  - 5+ users per role (admin, candidate, reviewer)
  - Multiple interviews per user
  - Random questions and answers

---

## Running the Application
Start the Laravel development server:
```bash
php artisan serve
```
Access API at: `http://localhost:8000`

---

## Seeder and Faker Setup
- All tables are seeded with relationships maintained.
- `answers.file_path` format: `uploads/answers/<submission_id>/<question_id>/<filename>.mp4`
- Questions, submissions, and answers are automatically generated per user.

Run seeders manually if needed:
```bash
php artisan db:seed
```

---

## Storage Link
Laravel stores uploaded files in `storage/app/public`. Make them publicly accessible:
```bash
php artisan storage:link
```
Access uploaded files via: `http://localhost:8000/storage/...`

---

## API Endpoints
All APIs are RESTful and require authentication where noted.

### Users
- **GET** `/api/users` - List all candidates & reviewers
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/{id}` - Update user
- **DELETE** `/api/users/{id}` - Soft delete user

### Interviews
- **GET** `/api/interviews` - List all interviews
- **POST** `/api/interviews` - Create interview
- **GET** `/api/interviews/{id}` - Show single interview
- **PUT** `/api/interviews/{id}` - Update interview
- **DELETE** `/api/interviews/{id}` - Delete interview
- **POST** `/api/interviews/{id}/assign` - Assign users
- **GET** `/api/interviews/admin/assigned` - View assigned candidates

### Questions
- Managed within interviews
- Automatically created during seeding

### Submissions
- **POST** `/api/submissions` - Candidate uploads answers
- **GET** `/api/submissions/{interviewId}` - Reviewer lists submissions
- **GET** `/api/submissions/show/{id}` - Show single submission

### Reviews
- **POST** `/api/answers/{id}/review` - Reviewer scores an answer

**Authentication:**
- Bearer token required for protected routes
- Use Laravel Sanctum for token-based auth

---

## Guide Flow Route
A single endpoint can provide all role-based functionalities and mandatory fields.
- **GET** `/api/guide`
- Response example:
```json
{
  "roles": {
    "admin": {
      "users": ["create", "update", "delete"],
      "interviews": ["create", "update", "assign", "delete"]
    },
    "reviewer": {
      "submissions": ["list", "review"]
    },
    "candidate": {
      "submissions": ["upload"]
    }
  }
}
```
This endpoint can also provide screen descriptions, required fields, and sample API calls.

---

## Notes
- Make sure database credentials match `.env`
- Use Postman collection for testing all APIs
- All uploaded files are served via public storage link
- Seeder generates data respecting relationships

---

**Project Setup Complete!**
