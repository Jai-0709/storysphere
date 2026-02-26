import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookAPI } from '../services/api';

const WriterDashboard = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyBooks();
    }, []);

    const fetchMyBooks = async () => {
        try {
            const response = await bookAPI.getMyBooks();
            setBooks(response.data.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this book?')) return;

        try {
            await bookAPI.delete(id);
            setBooks(books.filter(b => b.id !== id));
        } catch (error) {
            alert('Failed to delete book');
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Writer Dashboard</h1>
                <Link to="/writer/add-book" className="btn-primary">
                    ➕ Add New Book
                </Link>
            </div>

            {books.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500 mb-4">You haven't published any books yet</p>
                    <Link to="/writer/add-book" className="btn-primary">
                        Create Your First Book
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {books.map((book) => (
                        <div key={book.id} className="card p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-2">{book.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">by {book.author}</p>
                                    <div className="flex items-center space-x-6 text-sm">
                                        <span>📚 {book.genre_name}</span>
                                        <span>👁️ {book.views} views</span>
                                        <span>❤️ {book.like_count} likes</span>
                                        <span>💬 {book.comment_count} comments</span>
                                        <span>📖 {book.chapter_count} chapters</span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Link
                                        to={`/writer/book/${book.id}/chapters`}
                                        className="btn-primary text-sm"
                                    >
                                        📖 Chapters
                                    </Link>
                                    <Link to={`/writer/edit-book/${book.id}`} className="btn-secondary">
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(book.id)} className="btn-secondary text-red-600">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WriterDashboard;
