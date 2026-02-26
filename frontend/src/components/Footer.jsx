const Footer = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 mt-12">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">📚 StorySphere</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your digital storytelling platform. Read amazing stories and share your own.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">Home</a></li>
                            <li><a href="/login" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">Login</a></li>
                            <li><a href="/register" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">Register</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Email: support@storysphere.com<br />
                            Follow us on social media
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-6 text-center text-gray-600 dark:text-gray-400">
                    <p>&copy; 2024 StorySphere. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
