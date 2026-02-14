'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Test {
    id: string;
    title: string;
    createdAt: string;
    showResults: boolean;
    isActive: boolean;
    _count: {
        questions: number;
    };
}

export default function AdminDashboard() {
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [users, setUsers] = useState<{ id: string, name: string, username: string }[]>([]);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                router.push('/login');
                return;
            }
            try {
                const user = JSON.parse(userStr);
                if (user.role !== 'ADMIN') {
                    router.push('/login'); // or unauthorized page
                    return;
                }
                fetchTests();
                fetchUsers();
            } catch (error) {
                router.push('/login');
            }
        };
        checkAuth();
    }, [router]);

    const fetchTests = () => {
        fetch('/api/tests')
            .then((res) => res.json())
            .then((data) => {
                setTests(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const fetchUsers = () => {
        fetch('/api/admin/users')
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error(err));
    };

    const toggleResults = async (testId: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/tests/${testId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ showResults: !currentStatus })
            });
            if (res.ok) fetchTests(); // Reload
        } catch (err) {
            alert('Failed to update');
        }
    };

    const deleteTest = async (testId: string) => {
        if (!confirm("Are you sure you want to delete this test? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/tests/${testId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                alert('Test deleted successfully');
                fetchTests();
            } else {
                alert('Failed to delete test');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting test');
        }
    };

    const openAssignModal = (testId: string) => {
        setSelectedTestId(testId);
        setIsAssignModalOpen(true);
        setSelectedUserIds(new Set()); // Reset selection
        // Ideally fetch existing assignments here to pre-select
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUserIds(prev => {
            const next = new Set(prev);
            if (next.has(userId)) next.delete(userId);
            else next.add(userId);
            return next;
        });
    };

    const handleAssign = async () => {
        if (!selectedTestId || selectedUserIds.size === 0) return;
        setAssigning(true);
        try {
            const res = await fetch('/api/admin/assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testId: selectedTestId,
                    userIds: Array.from(selectedUserIds)
                })
            });

            if (res.ok) {
                alert('Test assigned successfully');
                setIsAssignModalOpen(false);
            } else {
                alert('Failed to assign test');
            }
        } catch (error) {
            console.error(error);
            alert('Error assigning test');
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        Admin Dashboard
                    </h1>
                    <Link
                        href="/admin/create"
                        className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium transition-colors shadow-lg shadow-cyan-500/20"
                    >
                        + Create New Test
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500 animate-pulse">Loading tests...</div>
                ) : tests.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
                        <h3 className="text-xl text-slate-300 mb-2">No tests found</h3>
                        <p className="text-slate-500">Create your first test to get started.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tests.map((test) => (
                            <div key={test.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/30 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold truncate pr-4">{test.title}</h3>
                                    {test.isActive ?
                                        <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded">Active</span> :
                                        <span className="bg-slate-700 text-slate-400 text-xs px-2 py-1 rounded">Inactive</span>
                                    }
                                </div>

                                <div className="text-sm text-slate-400 mb-4">
                                    {test._count.questions} questions
                                </div>
                                <div className="text-xs text-slate-600 mb-6">
                                    Created {new Date(test.createdAt).toLocaleDateString()}
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => openAssignModal(test.id)}
                                        className="w-full py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded text-sm transition-colors"
                                    >
                                        Assign to Users
                                    </button>

                                    <button
                                        onClick={() => toggleResults(test.id, test.showResults)}
                                        className={`w-full py-2 rounded text-sm font-medium transition-colors ${test.showResults
                                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                            : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                                            }`}
                                    >
                                        {test.showResults ? 'Results Released' : 'Release Results'}
                                    </button>

                                    <button
                                        onClick={() => deleteTest(test.id)}
                                        className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-sm transition-colors"
                                    >
                                        Delete Test
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Assignment Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4 text-white">Assign Test to Students</h2>
                        <div className="max-h-60 overflow-y-auto space-y-2 mb-6 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                            {users.map(user => (
                                <label key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                                    <span className="text-slate-300">{user.name} <span className="text-slate-500 text-xs">({user.username})</span></span>
                                    <input
                                        type="checkbox"
                                        checked={selectedUserIds.has(user.id)}
                                        onChange={() => toggleUserSelection(user.id)}
                                        className="w-5 h-5 accent-cyan-500 rounded"
                                    />
                                </label>
                            ))}
                            {users.length === 0 && <p className="text-slate-500 text-center py-4">No students found.</p>}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsAssignModalOpen(false)}
                                className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssign}
                                disabled={assigning || selectedUserIds.size === 0}
                                className="flex-1 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {assigning ? 'Assigning...' : `Assign (${selectedUserIds.size})`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
