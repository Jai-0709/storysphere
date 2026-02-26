const SearchBar = ({ value, onChange, placeholder = 'Search books...' }) => {
    return (
        <div className="relative">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="input-field pl-10"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
            </span>
        </div>
    );
};

export default SearchBar;
