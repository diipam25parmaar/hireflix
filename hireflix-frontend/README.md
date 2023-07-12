# Hireflix Frontend

This is the frontend for the **Hireflix Clone** developer challenge.\
It is built using **React (CRA)** with **Redux Toolkit**, **React Router
v6**, **TailwindCSS**, and **Axios**.

------------------------------------------------------------------------

## 🚀 Features

-   User Authentication (Login, Register, Forgot Password, Reset
    Password)
-   Role-based Access (Admin, Reviewer, Candidate)
-   Admin/Reviewer:
    -   Create interviews (title, description, questions)
    -   Assign interviews to candidates
    -   Manage users
-   Candidate:
    -   View assigned interviews
    -   Record and upload answers
-   Reviewer:
    -   Review candidate submissions
    -   Leave scores/comments
-   Protected routes with `PrivateRoute`
-   Global `Header` and `Footer`
-   Styled with **TailwindCSS** and **Styled Components**
-   Smooth animations using **Framer Motion**

------------------------------------------------------------------------

## 📂 Project Structure

    hireflix-frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CreateInterview.jsx
    │   │   ├── CandidateDashboard.jsx
    │   │   ├── RecordAnswers.jsx
    │   │   ├── ReviewerDashboard.jsx
    │   │   ├── ReviewAnswers.jsx
    │   │   ├── AssignInterview.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   └── ResetPassword.jsx
    │   │   └── ManageUsers.jsx
    │   ├── store/
    │   │   ├── store.js
    │   │   ├── authSlice.js
    │   │   ├── interviewsSlice.js
    │   │   ├── reviewSlice.js
    │   │   ├── adminSlice.js
    │   │   ├── candidateSlice.js
    │   │   ├── manageUserSlice.js
    │   │   ├── recordAnswersSlice.js
    │   │   ├── reviewAnswersSlice.js
    │   │   └── reviewerSlice.js
    │   ├── utils/
    │   │   └── axios.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── tailwind.config.js
    ├── package.json
    └── README.md

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **React 18**
-   **Redux Toolkit**
-   **React Router v6**
-   **Axios**
-   **TailwindCSS**
-   **Styled Components**
-   **Framer Motion**
-   **React Data Table Component**
-   **React Select**

------------------------------------------------------------------------

## ⚙️ Setup Instructions

### 1. Clone the Repository

``` bash
git clone <your-repo-url>
cd hireflix-frontend
```

### 2. Install Dependencies

``` bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add:

    REACT_APP_API_URL=http://127.0.0.1:8000/api

### 4. Run the App

``` bash
npm start
```

This will start the development server on <http://localhost:3000>.

### 5. Build for Production

``` bash
npm run build
```

------------------------------------------------------------------------

## 📜 Provided Code Snippets

### `utils/axios.js`

``` javascript
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api",
  headers: { Accept: "application/json" },
  withCredentials: true,
});

// Automatically attach token if present
API.interceptors.request.use((req) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // fail silently
  }
  return req;
});

export default API;
```

------------------------------------------------------------------------

### `src/index.js`

``` javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import './index.css' 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

------------------------------------------------------------------------

### `src/App.js`

``` javascript
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateInterview from "./pages/CreateInterview";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecordAnswers from "./pages/RecordAnswers";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import ReviewAnswers from "./pages/ReviewAnswers";
import AssignInterview from "./pages/AssignInterview";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ManageUsers from "./pages/ManageUsers";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-50 via-blue-50 to-gray-100">
        {/* Global Header */}
        <Header />

        {/* Main content */}
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-interview"
              element={
                <PrivateRoute>
                  <CreateInterview />
                </PrivateRoute>
              }
            />
            <Route
              path="/candidate-dashboard"
              element={
                <PrivateRoute>
                  <CandidateDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/reviewer-dashboard"
              element={
                <PrivateRoute>
                  <ReviewerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/interview/:id"
              element={
                <PrivateRoute>
                  <RecordAnswers />
                </PrivateRoute>
              }
            />
            <Route
              path="/review/:id"
              element={
                <PrivateRoute>
                  <ReviewAnswers />
                </PrivateRoute>
              }
            />

            {/* Misc Routes */}
            <Route path="/record-answers/:interviewId" element={<RecordAnswers />} />
            <Route path="/assign-interview" element={<AssignInterview />} />
            <Route path="/manage-users" element={<ManageUsers />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
```

------------------------------------------------------------------------

### `tailwind.config.js`

``` javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // scan all React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

------------------------------------------------------------------------

### `src/store/store.js`

``` javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import interviewsReducer from './interviewsSlice';
import reviewReducer from './reviewSlice';
import adminReducer from './adminSlice';
import CandidateReducer from './candidateSlice';
import ManageUserReducer from './manageUserSlice';
import recordAnswerReducer from './recordAnswersSlice';
import reviewAnswerReducer from './reviewAnswersSlice';
import reviewerReducer from './reviewerSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    interviews: interviewsReducer,
    review: reviewReducer,
    admin: adminReducer,
    candidate: CandidateReducer,
    manageUser: ManageUserReducer,  
    recordAnswers: recordAnswerReducer,
    reviewAnswers: reviewAnswerReducer,       
    reviewer: reviewerReducer,   
  },
});
```

------------------------------------------------------------------------

## ⚠️ Known Limitations

-   Backend API must be running (Laravel/PHP) at the URL configured in
    `.env`\
-   Video recording/upload flow may depend on browser permissions\
-   Some UI features are placeholders and may need further enhancement

------------------------------------------------------------------------

## 👤 Author

Developed by **Dipam Parmar** for the Horizon Sphere Equity Developer
Challenge.
