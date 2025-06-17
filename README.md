# 💰 Simple Expense Tracker

A minimal web app for tracking personal expenses with authentication. Users can register, log in (using email/password or Google OAuth), and manage their expenses — including titles, amounts, and dates — all in a clean dashboard.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js  
- **Frontend**: EJS templates, Bootstrap  
- **Authentication**: Passport.js (Local Strategy + Google OAuth 2.0)  
- **Database**: PostgreSQL  
- **Other**: bcrypt (password hashing), express-session, dotenv

---

## 🚀 Features

- Register new users with secure hashed passwords
- Log in using email/password or Google
- Add, view, and delete personal expense records
- User-specific data with session-based access control
- Clean and responsive Bootstrap UI

---

## 🗃️ Database Schema

### Table: `users`
| Column   | Type    |
|----------|---------|
| id       | SERIAL PRIMARY KEY |
| name     | TEXT    |
| email    | TEXT UNIQUE |
| password | TEXT (hashed) |

### Table: `expenses`
| Column   | Type    |
|----------|---------|
| id       | SERIAL PRIMARY KEY |
| user_id  | INTEGER REFERENCES users(id) ON DELETE CASCADE |
| title    | TEXT    |
| amount   | NUMERIC |
| date     | DATE    |

---

## 📦 Setup Instructions

### Install Dependencies
` npm install ` 

### Set Up .env File
Create a .env file in the root directory:

```
    SESSION_SECRET=your_session_secret
    PG_USER=your_pg_user
    PG_HOST=localhost
    PG_DATABASE=expense_tracker_db
    PG_PASSWORD=your_pg_password
    PG_PORT=5432

    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    CALLBACK_URL=http://localhost:3000/auth/google/callback
```

### Run the App

` npm start `

Visit http://localhost:3000 in your browser.


###  Clone the Repository

```
    git clone https://github.com/IvanCedric0/Expense_tracker-Nodejs-App.git
    cd expense-tracker
```
