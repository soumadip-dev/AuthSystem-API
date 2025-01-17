<h1 align="center">
  <br>
  User Authentication System (MERN)
  <br>
</h1>

<div align="center">
  <a href="https://github.com/soumadip-dev">
    <img src="https://skillicons.dev/icons?i=typescript,react,tailwindcss,nodejs,express,mongodb,github" alt="Tech Stack" width="20" style="padding: 15px 0;">
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

- **Frontend**: React,Tailwind CSS, Tanstack Query, React Router
- **Backend**: Node.js with Express – RESTful API structure
- **Database**: MongoDB with Mongoose – flexible document-based storage
- **Email Service**: Nodemailer
- **SMTP Server**: Brevo

---

## 🛠️ Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/soumadip-dev/Auth-Api-Mongo.git
   cd Auth-Api-Mongo
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   - Create a `.env` file in the root directory.
   - Add the following variables (replace placeholders with your actual values):

     ```env
     ########## SERVER CONFIGURATION ##########
     PORT=8000

     ########## DATABASE CONFIGURATION ##########
     MONGO_URL=your_mongodb_connection_string

     ########## BASE URL ##########
     BASE_URL=http://localhost:8000

     ########## MAILTRAP CONFIGURATION ##########
     MAILTRAP_HOST=sandbox.smtp.mailtrap.io
     MAILTRAP_PORT=2525
     MAILTRAP_USERNAME=your_mailtrap_username
     MAILTRAP_PASSWORD=your_mailtrap_password
     MAILTRAP_SENDEREMAIL=noreply@yourapp.com

     ########## JWT CONFIGURATION ##########
     JWT_SECRET_KEY=your_jwt_secret_key
     ```

4. **Start the server**:
   ```bash
   npm run start
   ```

---
