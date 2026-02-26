import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { genreAPI, bookAPI } from '../services/api';
import BookCard from '../components/BookCard';

const GenreBooks = () => {
    const { id } = useParams();
    const [genre, setGenre] = useState(null);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [genreRes, booksRes] = await Promise.all([
                genreAPI.getById(id),
                bookAPI.getByGenre(id)
            ]);
            setGenre(genreRes.data.data);
            setBooks(booksRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{genre?.name}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">{genre?.description}</p>
            </div>

            {books.length === 0 ? (
                <p className="text-center text-xl text-gray-500">No books in this genre yet</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default GenreBooks;
