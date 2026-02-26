import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    return (
        <Link to={`/book/${book.id}`} className="card overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img
                    src={book.cover_image || `https://placehold.co/400x600/6366f1/white?text=${encodeURIComponent(book.title)}`}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = `https://placehold.co/400x600/6366f1/white?text=${encodeURIComponent(book.title)}`;
                    }}
                />
                <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium shadow-md">
                    {book.genre_name}
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{book.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {book.author}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                    {book.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>👁️ {book.views || 0} views</span>
                    <span>❤️ {book.like_count || 0} likes</span>
                </div>
            </div>
        </Link>
    );
};

export default BookCard;
