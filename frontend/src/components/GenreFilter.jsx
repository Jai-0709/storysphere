const GenreFilter = ({ genres, selectedGenre, onSelect }) => {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onSelect('')}
                className={`px-4 py-2 rounded-lg transition-colors ${selectedGenre === ''
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
            >
                All Genres
            </button>
            {genres.map((genre) => (
                <button
                    key={genre.id}
                    onClick={() => onSelect(genre.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${selectedGenre === genre.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                >
                    {genre.name}
                </button>
            ))}
        </div>
    );
};

export default GenreFilter;
