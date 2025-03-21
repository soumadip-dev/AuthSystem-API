<h1 align="center">
  <br>
  User Authentication API
  <br>
</h1>

<div align="center">
  <a href="https://github.com/soumadip-dev">
    <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,github" alt="Tech Stack" width="200" style="padding: 15px 0;">
  </a>
</div>

<h3 align="center">
  A robust and secure user authentication system built with Node.js, Express, and MongoDB. Features include user registration, email verification, login, logout, password reset, and profile management.
</h3>

---

## 🚀 Features

- **User Registration**: Register new users with name, email, and password.
- **Email Verification**: Send verification emails to users for account activation.
- **Secure Login**: Authenticate users with email and password using JWT (JSON Web Tokens).
- **Forgot Password**: Allow users to request a password reset link via email.
- **Reset Password**: Securely reset passwords using a unique, time-limited token.
- **Profile Management**: Fetch user profile details (excluding sensitive information like passwords).
- **Logout**: Securely log out users by invalidating their JWT token.
- **Password Hashing**: Store passwords securely using bcrypt hashing.
- **Error Handling**: Comprehensive error handling for all endpoints.
- **Email Notifications**: Send emails for account verification and password reset using Nodemailer.
- **Environment Variables**: Secure configuration using environment variables for sensitive data (e.g., JWT secret, email credentials).

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **ORM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer
- **Environment Management**: dotenv
- **Version Control**: Git, GitHub

---

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/soumadip-dev/Auth-Api-Mongo.git
   cd Auth-Api-Mongo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     PORT=
     BASE_URL=

     # MongoDB Configuration
     MONGO_URL=

     # Mailtrap Configuration
     MAILTRAP_HOST=
     MAILTRAP_PORT=
     MAILTRAP_USERNAME=
     MAILTRAP_PASSWORD=
     ```

4. Start the server:
   ```bash
   npm run start
   ```
---
