import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookAPI, commentAPI, libraryAPI } from '../services/api';
import CommentSection from '../components/CommentSection';

const BookDetail = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [book, setBook] = useState(null);
    const [comments, setComments] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [inLibrary, setInLibrary] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookDetails();
        if (isAuthenticated) {
            checkLikeStatus();
            checkLibraryStatus();
        }
    }, [id, isAuthenticated]);

    const fetchBookDetails = async () => {
        try {
            const [bookRes, commentsRes] = await Promise.all([
                bookAPI.getById(id),
                commentAPI.getByBook(id)
            ]);
            setBook(bookRes.data.data);
            setComments(commentsRes.data.data);
            await bookAPI.incrementView(id);
        } catch (error) {
            console.error('Error fetching book:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkLikeStatus = async () => {
        try {
            const response = await commentAPI.getLikeStatus(id);
            setIsLiked(response.data.isLiked);
        } catch (error) {
            console.error('Error checking like status:', error);
        }
    };

    const checkLibraryStatus = async () => {
        try {
            const response = await libraryAPI.checkInLibrary(id);
            setInLibrary(response.data.inLibrary);
        } catch (error) {
            console.error('Error checking library status:', error);
        }
    };

    const handleLike = async () => {
        try {
            if (isLiked) {
                await commentAPI.unlikeBook(id);
                setIsLiked(false);
                setBook({ ...book, like_count: book.like_count - 1 });
            } else {
                await commentAPI.likeBook(id);
                setIsLiked(true);
                setBook({ ...book, like_count: book.like_count + 1 });
            }
        } catch (error) {
            alert('Failed to update like status');
        }
    };

    const handleLibrary = async () => {
        try {
            if (inLibrary) {
                await libraryAPI.removeFromLibrary(id);
                setInLibrary(false);
            } else {
                await libraryAPI.addToLibrary(id);
                setInLibrary(true);
            }
        } catch (error) {
            alert('Failed to update library');
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
    }

    if (!book) {
        return <div className="container mx-auto px-4 py-8 text-center">Book not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <img
                        src={book.cover_image || `https://placehold.co/400x600/6366f1/white?text=${encodeURIComponent(book.title)}`}
                        alt={book.title}
                        className="w-full rounded-lg shadow-lg"
                        onError={(e) => {
                            e.target.src = `https://placehold.co/400x600/6366f1/white?text=${encodeURIComponent(book.title)}`;
                        }}
                    />
                </div>

                <div className="md:col-span-2">
                    <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">by {book.author}</p>

                    <div className="flex items-center space-x-4 mb-6">
                        <span className="bg-primary-600 text-white px-3 py-1 rounded">{book.genre_name}</span>
                        <span>👁️ {book.views} views</span>
                        <span>❤️ {book.like_count} likes</span>
                        <span>💬 {book.comment_count} comments</span>
                    </div>

                    {isAuthenticated && (
                        <div className="flex space-x-4 mb-6">
                            <button onClick={handleLike} className={isLiked ? 'btn-primary' : 'btn-secondary'}>
                                {isLiked ? '❤️ Liked' : '🤍 Like'}
                            </button>
                            <button onClick={handleLibrary} className={inLibrary ? 'btn-primary' : 'btn-secondary'}>
                                {inLibrary ? '📚 In Library' : '➕ Add to Library'}
                            </button>
                        </div>
                    )}

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-3">Description</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{book.description}</p>
                    </div>

                    {book.chapters && book.chapters.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">Chapters ({book.chapters.length})</h2>
                                <Link
                                    to={`/read/${book.chapters[0].id}`}
                                    className="btn-primary"
                                >
                                    📖 Start Reading
                                </Link>
                            </div>
                            <div className="space-y-2">
                                {book.chapters.map((chapter, index) => (
                                    <Link
                                        key={chapter.id}
                                        to={`/read/${chapter.id}`}
                                        className="block card p-4 hover:shadow-lg hover:border-primary-500 transition-all duration-200 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold group-hover:text-primary-600 transition-colors">
                                                    {chapter.title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(chapter.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <svg
                                                className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CommentSection bookId={id} initialComments={comments} />
        </div>
    );
};

export default BookDetail;
