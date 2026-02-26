import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { chapterAPI, bookAPI } from '../services/api';

const ManageChapters = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null); // null = adding new
    const [formData, setFormData] = useState({
        title: '',
        chapter_number: 1,
        content: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, [bookId]);

    const fetchData = async () => {
        try {
            const [bookRes, chaptersRes] = await Promise.all([
                bookAPI.getById(bookId),
                chapterAPI.getByBook(bookId)
            ]);
            setBook(bookRes.data.data);
            const chaps = chaptersRes.data.data || [];
            setChapters(chaps);
            // Default next chapter number
            setFormData(prev => ({
                ...prev,
                chapter_number: chaps.length + 1
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to load book data');
            navigate('/writer/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const openAddForm = () => {
        setEditingChapter(null);
        setFormData({
            title: '',
            chapter_number: chapters.length + 1,
            content: ''
        });
        setShowForm(true);
    };

    const openEditForm = (chapter) => {
        setEditingChapter(chapter);
        setFormData({
            title: chapter.title,
            chapter_number: chapter.chapter_number,
            content: chapter.content || ''
        });
        setShowForm(true);
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingChapter(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingChapter) {
                await chapterAPI.update(editingChapter.id, formData);
            } else {
                await chapterAPI.create({ ...formData, book_id: bookId });
            }
            setShowForm(false);
            setEditingChapter(null);
            await fetchData();
        } catch (error) {
            console.error('Error saving chapter:', error);
            alert('Failed to save chapter. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (chapterId) => {
        if (!confirm('Are you sure you want to delete this chapter? This cannot be undone.')) return;
        try {
            await chapterAPI.delete(chapterId);
            setChapters(chapters.filter(c => c.id !== chapterId));
        } catch (error) {
            alert('Failed to delete chapter');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="text-xl">Loading chapters...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={() => navigate('/writer/dashboard')}
                    className="btn-secondary text-sm"
                >
                    ← Back to Dashboard
                </button>
            </div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Manage Chapters</h1>
                    {book && (
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-lg">
                            {book.title}
                        </p>
                    )}
                </div>
                {!showForm && (
                    <button onClick={openAddForm} className="btn-primary">
                        ➕ Add Chapter
                    </button>
                )}
            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <div className="card p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6">
                        {editingChapter ? `Edit: ${editingChapter.title}` : 'New Chapter'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block mb-2 font-medium">Chapter Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. The Beginning"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">Chapter Number *</label>
                                <input
                                    type="number"
                                    name="chapter_number"
                                    value={formData.chapter_number}
                                    onChange={handleChange}
                                    className="input-field"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">
                                Content *
                                <span className="text-sm font-normal text-gray-400 ml-2">
                                    ({formData.content.length} characters)
                                </span>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className="input-field resize-y"
                                rows="18"
                                placeholder="Write your chapter content here..."
                                required
                                style={{ minHeight: '300px', fontFamily: 'Georgia, serif', lineHeight: '1.8', fontSize: '1rem' }}
                            />
                        </div>

                        <div className="flex space-x-4 pt-2">
                            <button type="submit" disabled={saving} className="btn-primary">
                                {saving ? 'Saving...' : editingChapter ? '✅ Save Changes' : '✅ Create Chapter'}
                            </button>
                            <button type="button" onClick={cancelForm} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Chapter List */}
            {chapters.length === 0 ? (
                <div className="text-center py-16 card">
                    <p className="text-2xl text-gray-400 mb-2">📖 No chapters yet</p>
                    <p className="text-gray-500 mb-6">Start writing your first chapter!</p>
                    {!showForm && (
                        <button onClick={openAddForm} className="btn-primary">
                            Write First Chapter
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {chapters
                        .slice()
                        .sort((a, b) => a.chapter_number - b.chapter_number)
                        .map((chapter) => (
                            <div key={chapter.id} className="card p-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                                Chapter {chapter.chapter_number}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold">{chapter.title}</h3>
                                        {chapter.content && (
                                            <p className="text-gray-500 mt-2 text-sm line-clamp-2">
                                                {chapter.content.substring(0, 160)}...
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-2">
                                            {chapter.content ? chapter.content.length.toLocaleString() : 0} characters
                                        </p>
                                    </div>
                                    <div className="flex space-x-2 ml-4 shrink-0">
                                        <button
                                            onClick={() => openEditForm(chapter)}
                                            className="btn-secondary"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(chapter.id)}
                                            className="btn-secondary text-red-500"
                                        >
                                            🗑️ Delete
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

export default ManageChapters;
