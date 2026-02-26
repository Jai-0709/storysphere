# StorySphere - Complete Setup Guide

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Git** (optional, for version control)
- **Code Editor** (VS Code recommended)

---

## 🚀 Step-by-Step Setup

### Step 1: Verify Prerequisites

Open PowerShell and verify installations:

```powershell
node --version    # Should show v16.x.x or higher
npm --version     # Should show 8.x.x or higher
mysql --version   # Should show MySQL version
```

---

### Step 2: Navigate to Project Directory

```powershell
  cd C:\Users\mjais\.gemini\antigravity\scratch\storysphere
  ```

---

### Step 3: Backend Setup

#### 3.1 Install Backend Dependencies









```powershell
cd backend
npm install
```

This will install:
- express
- mysql2
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- nodemon (dev dependency)

#### 3.2 Create Environment File

```powershell
# Copy the example file
Copy-Item .env.example .env
```

#### 3.3 Configure Environment Variables

Open `backend\.env` in your editor and update:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=storysphere
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important**: Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.

---

### Step 4: Database Setup

#### 4.1 Start MySQL Service

```powershell
# Check if MySQL is running
Get-Service MySQL*

# If not running, start it
Start-Service MySQL80  # Or your MySQL service name
```

#### 4.2 Create Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE storysphere;
```

Or via command line:

```powershell
mysql -u root -p -e "CREATE DATABASE storysphere;"
```

#### 4.3 Import Database Schema

```powershell
# From the backend directory
mysql -u root -p storysphere < models/db.sql
```

Or manually:
1. Open MySQL Workbench
2. Connect to your server
3. Open `backend/models/db.sql`
4. Execute the script

#### 4.4 Verify Database Tables

```powershell
mysql -u root -p -e "USE storysphere; SHOW TABLES;"
```

You should see 8 tables:
- users
- genres
- books
- chapters
- comments
- likes
- library
- reading_progress

---

### Step 5: Seed Database with Sample Data

```powershell
# Make sure you're in the backend directory
npm run seed
```

This will create:
- 16 users (1 admin, 10 writers, 5 readers)
- 15 genres
- 100+ books
- 300+ chapters
- 50+ comments
- 100+ likes

**Expected output:**
```
🌱 Starting database seeding...
✓ Admin user created
✓ Created 10 writer users
✓ Created 5 reader users
✓ Created 15 genres
✓ Created 150 books
✓ Created 450 chapters
✓ Created 50 comments
✓ Created 100 likes
✅ Database seeding completed successfully!
```

---

### Step 6: Start Backend Server

```powershell
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

**Expected output:**
```
✓ Database connected successfully
🚀 StorySphere API Server running on port 5000
📍 API URL: http://localhost:5000
📚 Environment: development
```

**Test the API:**
Open browser and visit: `http://localhost:5000`

You should see:
```json
{
  "success": true,
  "message": "StorySphere API is running",
  "version": "1.0.0"
}
```

---

### Step 7: Frontend Setup

Open a **new PowerShell window** (keep backend running):

#### 7.1 Navigate to Frontend Directory

```powershell
cd C:\Users\mjais\.gemini\antigravity\scratch\storysphere\frontend
```

#### 7.2 Install Frontend Dependencies

```powershell
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- vite
- tailwindcss
- autoprefixer
- postcss

#### 7.3 Start Frontend Development Server

```powershell
npm audit fix --force
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

---

### Step 8: Access the Application

Open your browser and visit: **http://localhost:3000**

You should see the StorySphere homepage with:
- Navigation bar
- Hero section
- Genre filters
- Book grid

---

## 🔐 Login Credentials

Use these demo accounts to test the application:

### Admin Account
- **Email**: admin@storysphere.com
- **Password**: admin123
- **Access**: Full platform access, user management, statistics

### Writer Account
- **Email**: writer1@storysphere.com
- **Password**: writer123
- **Access**: Create/edit books, view statistics

### Reader Account
- **Email**: reader1@storysphere.com
- **Password**: reader123
- **Access**: Read books, comment, like, save to library

---

## ✅ Verification Checklist

Test these features to ensure everything works:

### Backend Tests
- [ ] API health check: `http://localhost:5000`
- [ ] Get genres: `http://localhost:5000/api/genres`
- [ ] Get books: `http://localhost:5000/api/books`

### Frontend Tests
- [ ] Homepage loads with books
- [ ] Search functionality works
- [ ] Genre filtering works
- [ ] Login with demo account
- [ ] View book details
- [ ] Like a book (when logged in)
- [ ] Add comment (when logged in)
- [ ] Add book to library (when logged in)

### Writer Tests (login as writer)
- [ ] Access Writer Dashboard
- [ ] Create new book
- [ ] Edit existing book
- [ ] View book statistics

### Admin Tests (login as admin)
- [ ] Access Admin Dashboard
- [ ] View platform statistics
- [ ] Manage users
- [ ] Change user roles

---

## 🛠️ Troubleshooting

### Backend Issues

**Problem**: Database connection error
```
Error connecting to database: ER_ACCESS_DENIED_ERROR
```
**Solution**: 
- Check MySQL password in `.env` file
- Verify MySQL service is running
- Check database name is correct

**Problem**: Port 5000 already in use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
- Change PORT in `.env` to 5001 or another port
- Or kill the process using port 5000

**Problem**: Seed script fails
```
Error seeding database
```
**Solution**:
- Ensure database schema is imported first
- Check database connection in `.env`
- Verify MySQL service is running

### Frontend Issues

**Problem**: Cannot connect to backend
```
Network Error
```
**Solution**:
- Ensure backend is running on port 5000
- Check `vite.config.js` proxy settings
- Clear browser cache

**Problem**: Port 3000 already in use
**Solution**:
- Vite will automatically use next available port (3001, 3002, etc.)
- Or manually specify port in `vite.config.js`

**Problem**: Styles not loading
**Solution**:
- Run `npm install` again
- Delete `node_modules` and reinstall
- Clear browser cache

---

## 📁 Project Structure Overview

```
storysphere/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic (7 controllers)
│   ├── middleware/      # Auth & role middleware
│   ├── models/          # Database schema (db.sql)
│   ├── routes/          # API routes (7 route files)
│   ├── scripts/         # Seed script
│   ├── utils/           # Helper functions
│   ├── .env             # Environment variables (create this)
│   ├── .env.example     # Environment template
│   ├── package.json     # Dependencies
│   └── server.js        # Express server
│
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable components (8 files)
│   │   ├── context/     # Auth & Theme context
│   │   ├── pages/       # Page components (10 files)
│   │   ├── services/    # API service (axios)
│   │   ├── App.jsx      # Main app with routes
│   │   ├── main.jsx     # Entry point
│   │   └── index.css    # Global styles
│   ├── index.html       # HTML template
│   ├── package.json     # Dependencies
│   ├── vite.config.js   # Vite configuration
│   └── tailwind.config.js # Tailwind configuration
│
├── README.md            # Project documentation
└── DEPLOYMENT.md        # Deployment guide
```

---

## 🎯 Quick Start Commands

### Terminal 1 (Backend)
```powershell
cd C:\Users\mjais\.gemini\antigravity\scratch\storysphere\backend
npm install
# Configure .env file
npm run seed
npm run dev
```

### Terminal 2 (Frontend)
```powershell
cd C:\Users\mjais\.gemini\antigravity\scratch\storysphere\frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints Reference

### Base URL
```
http://localhost:5000/api
```

### Quick Test Endpoints

**Get all genres:**
```
GET http://localhost:5000/api/genres
```

**Get all books:**
```
GET http://localhost:5000/api/books
```

**Search books:**
```
GET http://localhost:5000/api/books?search=love
```

**Filter by genre:**
```
GET http://localhost:5000/api/books?genre=1
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "admin@storysphere.com",
  "password": "admin123"
}
```

---

## 🎨 Features to Test

### As a Reader
1. Browse books on homepage
2. Search for books by title/author
3. Filter books by genre
4. Click on a book to view details
5. Register a new account
6. Login with your account
7. Like a book
8. Add a comment
9. Save book to library
10. View your library

### As a Writer
1. Login with writer account
2. Go to Writer Dashboard
3. Click "Add New Book"
4. Fill in book details
5. Create the book
6. View your book statistics
7. Edit your book
8. View all your books

### As an Admin
1. Login with admin account
2. Go to Admin Dashboard
3. View platform statistics
4. See all users
5. Change a user's role
6. View top books

---

## 🔄 Development Workflow

### Making Changes

**Backend changes:**
1. Edit files in `backend/`
2. Server auto-restarts (nodemon)
3. Test in browser/Postman

**Frontend changes:**
1. Edit files in `frontend/src/`
2. Vite hot-reloads automatically
3. See changes instantly in browser

### Adding New Features

**New API endpoint:**
1. Add controller function in `backend/controllers/`
2. Add route in `backend/routes/`
3. Test with Postman or browser

**New page:**
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in Navbar

---

## 📚 Next Steps

1. ✅ Complete setup (you are here!)
2. 🎨 Customize the design
3. 📝 Add more features
4. 🚀 Deploy to production (see DEPLOYMENT.md)
5. 🔒 Add security enhancements
6. 📊 Add analytics
7. 📧 Add email notifications

---

## 🆘 Getting Help

If you encounter issues:

1. Check the console for error messages
2. Verify all services are running
3. Check environment variables
4. Review the troubleshooting section
5. Check database connection
6. Ensure all dependencies are installed

---

## ✨ You're All Set!

Your StorySphere platform is now running with:
- ✅ Backend API on http://localhost:5000
- ✅ Frontend app on http://localhost:3000
- ✅ Database with 100+ books
- ✅ Demo accounts ready to use

**Happy coding! 🚀**
