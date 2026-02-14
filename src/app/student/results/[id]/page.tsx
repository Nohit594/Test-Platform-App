'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import LatexRenderer from '@/components/LatexRenderer';

interface QuestionAnalysis {
    id: string;
    number: number;
    text: string;
    options: string;
    correctAnswer: number;
    studentAnswer: number | undefined;
    isCorrect: boolean;
}

interface ResultData {
    testTitle: string;
    score: number;
    totalQuestions: number;
    analysis: QuestionAnalysis[];
}

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const testId = resolvedParams.id;
    const router = useRouter();
    const [data, setData] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const studentName = localStorage.getItem('studentName');
        if (!studentName) {
            router.push('/student');
            return;
        }

        fetch(`/api/student/results/${testId}?name=${encodeURIComponent(studentName)}`)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 403) throw new Error('Results are not available yet.');
                    throw new Error('Failed to load results');
                }
                return res.json();
            })
            .then(setData)
            .catch(err => {
                setError(err.message);
                setLoading(false);
            })
            .finally(() => setLoading(false));
    }, [testId, router]);

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading Results...</div>;
    if (error) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
            <p className="text-xl">{error}</p>
            <Link href="/student" className="text-cyan-400 hover:underline">Return to Dashboard</Link>
        </div>
    );
    if (!data) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex justify-between items-end border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            {data.testTitle}
                        </h1>
                        <p className="text-slate-400 mt-2">Analysis Report</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold text-cyan-400">{data.score}</div>
                        <div className="text-slate-500 text-sm">Total Score</div>
                    </div>
                </div>

                <div className="space-y-8">
                    {data.analysis.map((q) => {
                        const options = JSON.parse(q.options) as string[];
                        return (
                            <div key={q.id} className={`p-6 rounded-2xl border ${q.isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'
                                }`}>
                                <div className="flex gap-4 mb-4">
                                    <span className={`font-bold text-lg ${q.isCorrect ? 'text-green-400' : 'text-red-400'}`}>Q{q.number}</span>
                                    <div className="text-lg">
                                        <LatexRenderer text={q.text} />
                                    </div>
                                </div>

                                <div className="space-y-2 pl-10">
                                    {options.map((opt, idx) => {
                                        let optionClass = "bg-slate-900 border-slate-800 text-slate-400"; // Default

                                        if (idx === q.correctAnswer) {
                                            optionClass = "bg-green-500/20 border-green-500/50 text-green-300 font-medium";
                                        } else if (idx === q.studentAnswer && !q.isCorrect) {
                                            optionClass = "bg-red-500/20 border-red-500/50 text-red-300";
                                        }

                                        return (
                                            <div key={idx} className={`p-3 rounded-lg border ${optionClass} flex items-center justify-between`}>
                                                <span className="flex-1 mr-4"><LatexRenderer text={opt} /></span>
                                                {idx === q.correctAnswer && <span className="text-xs font-bold text-green-500 uppercase px-2 whitespace-nowrap">Correct Answer</span>}
                                                {idx === q.studentAnswer && idx !== q.correctAnswer && <span className="text-xs font-bold text-red-500 uppercase px-2 whitespace-nowrap">Your Answer</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 text-center">
                    <Link href="/student" className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold transition-colors">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
