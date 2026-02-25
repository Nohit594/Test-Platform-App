'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Attempt {
    id: string;
    score: number;
    createdAt: string;
}

interface Test {
    id: string;
    title: string;
    questionCount: number;
    createdAt: string;
    showResults: boolean;
    attempt: Attempt | null;
}

export default function StudentDashboard() {
    const [name, setName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(false);
    const [inProgressTests, setInProgressTests] = useState<Set<string>>(new Set());
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                router.push('/login');
                return;
            }
            try {
                const user = JSON.parse(userStr);
                if (user.role !== 'STUDENT') {
                    // If admin tries to access student page, maybe allowed? But strict for now.
                    // router.push('/admin'); 
                    // Let's allow admins to view it potentially, but for now strict.
                    if (user.role === 'ADMIN') {
                        // Admin might want to debug, but let's keep it clean
                        // router.push('/admin');
                    } else {
                        router.push('/login');
                    }
                }
                setName(user.name); // Display name
                setIsAuthenticated(true);
                // We use USERNAME for fetching data as per API refactor
                fetchDashboard(user.username);
            } catch (e) {
                localStorage.removeItem('user');
                router.push('/login');
            }
        };
        checkAuth();
    }, [router]);

    useEffect(() => {
        const studentName = localStorage.getItem('studentName');
        if (!studentName) return;

        // Check local storage for any in-progress tests
        const inProgress = new Set<string>();
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`testProgress_${studentName}_`)) {
                const testId = key.split('_')[2];
                if (testId) {
                    inProgress.add(testId);
                }
            }
        }
        setInProgressTests(inProgress);
    }, [tests]); // Re-run when tests load


    const fetchDashboard = async (username: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/student/dashboard?name=${encodeURIComponent(username)}`);
            const data = await res.json();
            if (res.ok) {
                setTests(data.tests);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('studentName'); // cleanup old
        setIsAuthenticated(false);
        router.push('/login');
    };


    if (!isAuthenticated) {
        return null; // or loading spinner while redirecting
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-cyan-400">Student Portal</h1>
                        <p className="text-slate-400">Welcome, {name}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-slate-500 hover:text-white transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500 animate-pulse">Loading assessments...</div>
                ) : tests.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
                        <p className="text-slate-500">No active tests available at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tests.map((test) => (
                            <div key={test.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-slate-700 transition-all">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{test.title}</h3>
                                    <div className="flex gap-4 text-sm text-slate-400">
                                        <span>{test.questionCount} Questions</span>
                                        <span>•</span>
                                        <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div>
                                    {test.attempt ? (
                                        <div className="text-right">
                                            <div className="inline-block px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-medium">
                                                Submitted
                                            </div>
                                            {test.showResults ? (
                                                <div className="mt-2">
                                                    <div className="text-cyan-400 font-bold mb-1">Score: {test.attempt.score}</div>
                                                    <Link href={`/student/results/${test.id}`} className="text-sm text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-4">
                                                        View Analysis
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="mt-2 text-slate-500 text-sm italic">Results pending</div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={`/student/test/${test.id}`}
                                            className={`inline-block px-8 py-3 font-bold rounded-lg shadow-lg transition-all text-white ${inProgressTests.has(test.id)
                                                ? 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-500/20'
                                                : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/20'
                                                }`}
                                        >
                                            {inProgressTests.has(test.id) ? 'Resume Test' : 'Start Test'}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
