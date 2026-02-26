import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { commentAPI } from '../services/api';

const CommentSection = ({ bookId, initialComments = [] }) => {
    const { isAuthenticated, user } = useAuth();
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const response = await commentAPI.create({
                book_id: bookId,
                content: newComment
            });
            setComments([response.data.data, ...comments]);
            setNewComment('');
        } catch (error) {
            alert('Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm('Delete this comment?')) return;

        try {
            await commentAPI.delete(commentId);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            alert('Failed to delete comment');
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Comments ({comments.length})</h3>

            {isAuthenticated && (
                <form onSubmit={handleSubmit} className="mb-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="input-field min-h-[100px] resize-none"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !newComment.trim()}
                        className="btn-primary mt-2"
                    >
                        {loading ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="card p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="font-semibold">{comment.username}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                {(user?.id === comment.user_id || user?.role === 'admin') && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
