# <h1 align="center">User Authentication System (MERN)</h1>

<div align="center">
  <a href="https://github.com/soumadip-dev">
    <img src="https://skillicons.dev/icons?i=react,typescript,tailwindcss,nodejs,express,mongodb,github" alt="Tech Stack" width="300" style="padding: 15px 0;">
  </a>
</div>

<h3 align="center">
  A secure MERN authentication system with user registration, email verification, login, logout, password reset, and profile management.
</h3>

---

## 🌟 Features

- **User Registration**: Register new users with name, email, and password.
- **Email Verification**: Send verification emails for account activation.
- **Secure Login**: Authenticate users via email/password using JWT (JSON Web Tokens).
- **Forgot Password**: Request a password reset link via email.
- **Reset Password**: Securely reset passwords using a time-limited token.
- **Logout**: Invalidate JWT tokens to log users out securely.
- **Password Hashing**: bcrypt-based hashing for secure password storage.
- **Email Notifications**: Nodemailer-powered emails for verification and password resets.

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Tanstack Query, React Router
- **Backend**: Node.js with Express – RESTful API structure
- **Database**: MongoDB with Mongoose – flexible document-based storage
- **Email Service**: Nodemailer
- **SMTP Server**: Brevo

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/soumadip-dev/AuthSystem-MERN.git
   cd AuthSystem-MERN
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server` directory with:

   ```env
   PORT=8080
   MONGO_URI=<YOUR_MONGODB_URI>
   BASE_URL=http://127.0.0.1:8080
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   BREVO_HOST=smtp.brevo.com
   BREVO_PORT=587
   BREVO_USERNAME=<your_email_address>
   BREVO_PASSWORD=<your_email_password>
   BREVO_SENDEREMAIL=<your_email_address>
   JWT_SECRET=<your_secret_key>
   ```

3. **Frontend Setup**

   ```bash
   cd ../client
   npm install
   ```

   Create a `.env` file in the `client` directory with:

   ```env
   VITE_BACKEND_URL=<YOUR_BACKEND_URL>
   ```

4. **Run the Application**
   - Backend (Terminal 1):
     ```bash
     cd server
     npm run dev
     ```
   - Frontend (Terminal 2):
     ```bash
     cd ../client
     npm run dev
     ```

---
