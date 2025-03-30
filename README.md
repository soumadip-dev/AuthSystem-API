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
- **Email Verification**: Send verification emails for account activation.
- **Secure Login**: Authenticate users via email/password using JWT (JSON Web Tokens).
- **Forgot Password**: Request a password reset link via email.
- **Reset Password**: Securely reset passwords using a time-limited token.
- **Profile Management**: Fetch user details (excluding sensitive data like passwords).
- **Logout**: Invalidate JWT tokens to log users out securely.
- **Password Hashing**: bcrypt-based hashing for secure password storage.
- **Error Handling**: Comprehensive error responses for all endpoints.
- **Email Notifications**: Nodemailer-powered emails for verification and password resets.
- **Environment Variables**: Secure configuration using `.env` for sensitive data (JWT secret, email credentials, etc.).

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **ORM**: Mongoose
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer
- **Environment Management**: dotenv
- **Version Control**: Git, GitHub

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