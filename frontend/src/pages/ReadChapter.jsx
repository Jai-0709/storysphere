import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { chapterAPI } from '../services/api';

const ReadChapter = () => {
    const { chapterId } = useParams();
    const navigate = useNavigate();
    const [chapter, setChapter] = useState(null);
    const [allChapters, setAllChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetchChapterData();
    }, [chapterId]);

    const fetchChapterData = async () => {
        try {
            setLoading(true);
            const response = await chapterAPI.getById(chapterId);
            const chapterData = response.data.data;
            setChapter(chapterData);

            // Fetch all chapters for this book
            const chaptersResponse = await chapterAPI.getByBook(chapterData.book_id);
            const chapters = chaptersResponse.data.data;
            setAllChapters(chapters);

            // Find current chapter index
            const index = chapters.findIndex(ch => ch.id === parseInt(chapterId));
            setCurrentIndex(index);
        } catch (error) {
            console.error('Error fetching chapter:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToNextChapter = () => {
        if (currentIndex < allChapters.length - 1) {
            const nextChapter = allChapters[currentIndex + 1];
            navigate(`/read/${nextChapter.id}`);
        }
    };

    const goToPreviousChapter = () => {
        if (currentIndex > 0) {
            const prevChapter = allChapters[currentIndex - 1];
            navigate(`/read/${prevChapter.id}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading chapter...</p>
                </div>
            </div>
        );
    }

    if (!chapter) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Chapter not found</h2>
                <button onClick={() => navigate(-1)} className="btn-primary">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            to={`/books/${chapter.book_id}`}
                            className="text-primary-600 hover:text-primary-700 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Book
                        </Link>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Chapter {currentIndex + 1} of {allChapters.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reading Content */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
                    {/* Chapter Header */}
                    <header className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                            {chapter.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {chapter.book_title}
                        </p>
                    </header>

                    {/* Chapter Content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {chapter.content}
                        </div>
                    </div>

                    {/* Navigation Footer */}
                    <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={goToPreviousChapter}
                                disabled={currentIndex === 0}
                                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous Chapter
                            </button>

                            <div className="text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {currentIndex + 1} / {allChapters.length}
                                </p>
                            </div>

                            <button
                                onClick={goToNextChapter}
                                disabled={currentIndex === allChapters.length - 1}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                Next Chapter
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </footer>
                </article>

                {/* Chapter List Sidebar */}
                {allChapters.length > 0 && (
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            All Chapters
                        </h2>
                        <div className="space-y-2">
                            {allChapters.map((ch, index) => (
                                <Link
                                    key={ch.id}
                                    to={`/read/${ch.id}`}
                                    className={`block p-3 rounded-lg transition-colors ${ch.id === parseInt(chapterId)
                                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{ch.title}</span>
                                        {ch.id === parseInt(chapterId) && (
                                            <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded">
                                                Reading
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReadChapter;
