import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getUsers()
            ]);
            setStats(statsRes.data.data);
            setUsers(usersRes.data.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminAPI.updateUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            alert('User role updated successfully');
        } catch (error) {
            alert('Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await adminAPI.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            alert('User deleted successfully');
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-primary-600">{stats?.users.total}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Readers: {stats?.users.readers} | Writers: {stats?.users.writers} | Admins: {stats?.users.admins}
                    </p>
                </div>
                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-2">Total Books</h3>
                    <p className="text-3xl font-bold text-primary-600">{stats?.books}</p>
                    <p className="text-sm text-gray-500 mt-2">{stats?.chapters} chapters</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-2">Total Views</h3>
                    <p className="text-3xl font-bold text-primary-600">{stats?.totalViews}</p>
                    <p className="text-sm text-gray-500 mt-2">{stats?.totalLikes} likes</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-2">Comments</h3>
                    <p className="text-3xl font-bold text-primary-600">{stats?.comments}</p>
                    <p className="text-sm text-gray-500 mt-2">{stats?.genres} genres</p>
                </div>
            </div>

            {/* User Management */}
            <div className="card p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">User Management</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="text-left p-3">Username</th>
                                <th className="text-left p-3">Email</th>
                                <th className="text-left p-3">Role</th>
                                <th className="text-left p-3">Joined</th>
                                <th className="text-left p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b dark:border-gray-700">
                                    <td className="p-3">{user.username}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="input-field py-1 text-sm"
                                        >
                                            <option value="reader">Reader</option>
                                            <option value="writer">Writer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-3">{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-600 hover:text-red-700 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Books */}
            {stats?.topBooks && stats.topBooks.length > 0 && (
                <div className="card p-6">
                    <h2 className="text-2xl font-bold mb-4">Top Books by Views</h2>
                    <div className="space-y-3">
                        {stats.topBooks.map((book, index) => (
                            <div key={book.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                <div>
                                    <span className="font-semibold mr-2">#{index + 1}</span>
                                    <span>{book.title}</span>
                                    <span className="text-sm text-gray-500 ml-2">by {book.author}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="mr-4">👁️ {book.views}</span>
                                    <span>❤️ {book.like_count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
