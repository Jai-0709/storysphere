import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { genreAPI, bookAPI } from '../services/api';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';

const Home = () => {
    const [genres, setGenres] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchGenres();
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [search, selectedGenre, page]);

    const fetchGenres = async () => {
        try {
            const response = await genreAPI.getAll();
            setGenres(response.data.data);
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await bookAPI.getAll({
                page,
                limit: 12,
                search,
                genre: selectedGenre
            });
            setBooks(response.data.data);
            setTotalPages(response.data.pages);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleGenreSelect = (genreId) => {
        setSelectedGenre(genreId);
        setPage(1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">Welcome to StorySphere</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                    Discover amazing stories from talented writers around the world
                </p>
                <div className="max-w-2xl mx-auto">
                    <SearchBar value={search} onChange={handleSearch} />
                </div>
            </div>

            {/* Genre Filter */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Browse by Genre</h2>
                <GenreFilter
                    genres={genres}
                    selectedGenre={selectedGenre}
                    onSelect={handleGenreSelect}
                />
            </div>

            {/* Books Grid */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">
                    {selectedGenre ? `${genres.find(g => g.id === selectedGenre)?.name} Books` : 'All Books'}
                </h2>
                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-xl">Loading books...</div>
                    </div>
                ) : books.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-500">No books found</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {books.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 mt-8">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="btn-secondary disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-4">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="btn-secondary disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
