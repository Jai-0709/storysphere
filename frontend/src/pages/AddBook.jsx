import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { genreAPI, bookAPI } from '../services/api';

const AddBook = () => {
    const [genres, setGenres] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        cover_image: '',
        genre_id: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const response = await genreAPI.getAll();
            setGenres(response.data.data);
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await bookAPI.create(formData);
            alert('Book created successfully!');
            navigate('/writer/dashboard');
        } catch (error) {
            alert('Failed to create book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Add New Book</h1>

            <form onSubmit={handleSubmit} className="max-w-2xl card p-8">
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 font-medium">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Author *</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Genre *</label>
                        <select
                            name="genre_id"
                            value={formData.genre_id}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            <option value="">Select a genre</option>
                            {genres.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field min-h-[120px] resize-none"
                            rows="5"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Cover Image URL</label>
                        <input
                            type="url"
                            name="cover_image"
                            value={formData.cover_image}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Creating...' : 'Create Book'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/writer/dashboard')}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddBook;
