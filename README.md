# StorySphere - Digital Storytelling Platform

A complete production-ready web application for reading and writing stories, featuring user authentication, role-based access control, and a rich set of features for readers, writers, and administrators.

## 🚀 Features

### For Readers
- Browse 100+ books across 15 genres
- Search books by title or author
- Filter books by genre
- Like and comment on books
- Save books to personal library
- Track reading progress

### For Writers
- Create and publish books
- Add multiple chapters to books
- Edit and delete own books
- View book statistics (views, likes, comments)
- Manage book content

### For Admins
- User management (view, update roles, delete)
- Platform statistics dashboard
- Content moderation
- Genre management

## 📋 Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** authentication
- **bcryptjs** for password hashing
- RESTful API architecture

### Frontend
- **React** 18 with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- Context API for state management
- Dark mode support

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env` file (copy from `.env.example`):
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update `.env` with your database credentials:
\`\`\`
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=storysphere
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
\`\`\`

5. Create database and run schema:
\`\`\`bash
mysql -u root -p < models/db.sql
\`\`\`

6. Seed the database with sample data:
\`\`\`bash
npm run seed
\`\`\`

7. Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Frontend will run on `http://localhost:3000`

## 🔐 Demo Accounts

After running the seed script, you can login with:

- **Admin**: admin@storysphere.com / admin123
- **Writer**: writer1@storysphere.com / writer123
- **Reader**: reader1@storysphere.com / reader123

## 📊 Database Schema

The application uses 8 main tables:
- `users` - User accounts and authentication
- `genres` - Book genres (15 total)
- `books` - Book metadata
- `chapters` - Book chapters
- `comments` - User comments on books
- `likes` - Book likes
- `library` - User's saved books
- `reading_progress` - Reading progress tracking

## 🌐 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - Logout user

### Genres
- GET `/api/genres` - Get all genres
- GET `/api/genres/:id` - Get genre by ID
- POST `/api/genres` - Create genre (Admin)
- PUT `/api/genres/:id` - Update genre (Admin)
- DELETE `/api/genres/:id` - Delete genre (Admin)

### Books
- GET `/api/books` - Get all books (with pagination, search, filter)
- GET `/api/books/:id` - Get book by ID
- GET `/api/books/genre/:genreId` - Get books by genre
- GET `/api/books/writer/my-books` - Get writer's books
- POST `/api/books` - Create book (Writer/Admin)
- PUT `/api/books/:id` - Update book (Owner/Admin)
- DELETE `/api/books/:id` - Delete book (Owner/Admin)
- POST `/api/books/:id/view` - Increment view count

### Chapters
- GET `/api/chapters/book/:bookId` - Get chapters by book
- GET `/api/chapters/:id` - Get chapter by ID
- POST `/api/chapters` - Create chapter (Writer/Admin)
- PUT `/api/chapters/:id` - Update chapter (Owner/Admin)
- DELETE `/api/chapters/:id` - Delete chapter (Owner/Admin)

### Comments & Likes
- GET `/api/comments/book/:bookId` - Get comments by book
- POST `/api/comments` - Create comment
- DELETE `/api/comments/:id` - Delete comment (Owner/Admin)
- POST `/api/comments/books/:id/like` - Like book
- DELETE `/api/comments/books/:id/unlike` - Unlike book
- GET `/api/comments/books/:id/like-status` - Get like status

### Library & Progress
- GET `/api/library` - Get user's library
- GET `/api/library/check/:bookId` - Check if book in library
- POST `/api/library/:bookId` - Add book to library
- DELETE `/api/library/:bookId` - Remove book from library
- POST `/api/library/reading-progress` - Update reading progress
- GET `/api/library/reading-progress/:bookId` - Get reading progress

### Admin
- GET `/api/admin/users` - Get all users
- PUT `/api/admin/users/:id/role` - Update user role
- DELETE `/api/admin/users/:id` - Delete user
- GET `/api/admin/stats` - Get platform statistics

## 📁 Project Structure

\`\`\`
storysphere/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & role middleware
│   ├── models/          # Database schema
│   ├── routes/          # API routes
│   ├── scripts/         # Seed script
│   ├── utils/           # Helper functions
│   └── server.js        # Express server
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context providers
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── index.html       # HTML template
└── README.md
\`\`\`

## 🎨 Features Implemented

✅ User authentication with JWT
✅ Role-based access control (Reader, Writer, Admin)
✅ 15 genres with 100+ AI-generated books
✅ Book browsing with search and filter
✅ Book detail pages with chapters
✅ Like and comment system
✅ Personal library management
✅ Reading progress tracking
✅ Writer dashboard with book management
✅ Admin dashboard with user management
✅ Dark mode support
✅ Responsive design
✅ Pagination for book listings

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for Railway, Render, and Vercel.

## 📝 License

MIT License - feel free to use this project for learning or production.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
