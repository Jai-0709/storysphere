import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookDetail from './pages/BookDetail';
import ReadChapter from './pages/ReadChapter';
import GenreBooks from './pages/GenreBooks';
import MyLibrary from './pages/MyLibrary';
import WriterDashboard from './pages/WriterDashboard';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import AdminDashboard from './pages/AdminDashboard';
import ManageChapters from './pages/ManageChapters';

function App() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl">Loading...</div>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        {/* Public routes — only login & register are accessible without auth */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* All protected routes — requires login */}
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } />
                        <Route path="/book/:id" element={
                            <ProtectedRoute>
                                <BookDetail />
                            </ProtectedRoute>
                        } />
                        <Route path="/read/:chapterId" element={
                            <ProtectedRoute>
                                <ReadChapter />
                            </ProtectedRoute>
                        } />
                        <Route path="/genre/:id" element={
                            <ProtectedRoute>
                                <GenreBooks />
                            </ProtectedRoute>
                        } />

                        <Route path="/library" element={
                            <ProtectedRoute>
                                <MyLibrary />
                            </ProtectedRoute>
                        } />

                        <Route path="/writer/dashboard" element={
                            <ProtectedRoute requireWriter>
                                <WriterDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/writer/add-book" element={
                            <ProtectedRoute requireWriter>
                                <AddBook />
                            </ProtectedRoute>
                        } />

                        <Route path="/writer/edit-book/:id" element={
                            <ProtectedRoute requireWriter>
                                <EditBook />
                            </ProtectedRoute>
                        } />

                        <Route path="/writer/book/:bookId/chapters" element={
                            <ProtectedRoute requireWriter>
                                <ManageChapters />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute requireAdmin>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
