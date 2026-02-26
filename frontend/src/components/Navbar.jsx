import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, isAuthenticated, isWriter, isAdmin, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        📚 StorySphere
                    </Link>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">
                                    Home
                                </Link>
                                <Link to="/library" className="hover:text-primary-600 dark:hover:text-primary-400">
                                    My Library
                                </Link>
                                {isWriter && (
                                    <Link to="/writer/dashboard" className="hover:text-primary-600 dark:hover:text-primary-400">
                                        Writer Dashboard
                                    </Link>
                                )}
                                {isAdmin && (
                                    <Link to="/admin/dashboard" className="hover:text-primary-600 dark:hover:text-primary-400">
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    aria-label="Toggle dark mode"
                                >
                                    {darkMode ? '☀️' : '🌙'}
                                </button>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm">👤 {user?.username}</span>
                                    <button onClick={logout} className="btn-secondary text-sm">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">
                                    Home
                                </Link>
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    aria-label="Toggle dark mode"
                                >
                                    {darkMode ? '☀️' : '🌙'}
                                </button>
                                <Link to="/login" className="btn-secondary text-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
