import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { genreAPI, bookAPI } from '../services/api';

const EditBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        cover_image: '',
        genre_id: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [genresRes, bookRes] = await Promise.all([
                genreAPI.getAll(),
                bookAPI.getById(id)
            ]);
            setGenres(genresRes.data.data);
            const book = bookRes.data.data;
            setFormData({
                title: book.title,
                author: book.author,
                description: book.description || '',
                cover_image: book.cover_image || '',
                genre_id: book.genre_id
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to load book');
            navigate('/writer/dashboard');
        } finally {
            setLoading(false);
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
        setSaving(true);

        try {
            await bookAPI.update(id, formData);
            alert('Book updated successfully!');
            navigate('/writer/dashboard');
        } catch (error) {
            alert('Failed to update book');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Edit Book</h1>

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
                        <button type="submit" disabled={saving} className="btn-primary">
                            {saving ? 'Saving...' : 'Save Changes'}
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

export default EditBook;
