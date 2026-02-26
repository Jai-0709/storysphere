import { useState, useEffect } from 'react';
import { libraryAPI } from '../services/api';
import BookCard from '../components/BookCard';

const MyLibrary = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLibrary();
    }, []);

    const fetchLibrary = async () => {
        try {
            const response = await libraryAPI.getLibrary();
            setBooks(response.data.data);
        } catch (error) {
            console.error('Error fetching library:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">My Library</h1>

            {books.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500 mb-4">Your library is empty</p>
                    <p className="text-gray-400">Start adding books to build your collection!</p>
                </div>
            ) : (
                <>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {books.length} book{books.length !== 1 ? 's' : ''} in your library
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <div key={book.id}>
                                <BookCard book={book} />
                                {book.progress_percentage > 0 && (
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full"
                                                style={{ width: `${book.progress_percentage}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {book.progress_percentage}% complete
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default MyLibrary;
