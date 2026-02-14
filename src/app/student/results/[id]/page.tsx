'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import LatexRenderer from '@/components/LatexRenderer';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

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
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);

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

    const scrollToQuestion = (index: number) => {
        const element = document.getElementById(`question-${index}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setIsPaletteOpen(false); // Close mobile drawer
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading Results...</div>;
    if (error) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
            <p className="text-xl">{error}</p>
            <Link href="/student" className="text-cyan-400 hover:underline">Return to Dashboard</Link>
        </div>
    );
    if (!data) return null;

    // Calculate stats
    const correctCount = data.analysis.filter(q => q.isCorrect).length;
    const incorrectCount = data.analysis.filter(q => q.studentAnswer !== undefined && !q.isCorrect).length;
    const unattemptedCount = data.analysis.filter(q => q.studentAnswer === undefined).length;

    return (
        <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden font-sans">
            {/* Header */}
            <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 truncate max-w-md">
                        {data.testTitle} - Analysis
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            <span className="text-slate-300">Correct: {correctCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span>
                            <span className="text-slate-300">Incorrect: {incorrectCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-slate-600"></span>
                            <span className="text-slate-300">Unattempted: {unattemptedCount}</span>
                        </div>
                        <div className="h-8 w-px bg-slate-700 mx-2"></div>
                        <div className="font-bold text-cyan-400 text-lg">Score: {data.score}</div>
                    </div>

                    <button
                        className="md:hidden p-2 text-slate-400"
                        onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                    >
                        {isPaletteOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <Link
                        href="/student"
                        className="hidden md:block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
                    >
                        Close
                    </Link>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {data.analysis.map((q, idx) => {
                                const options = JSON.parse(q.options) as string[];
                                const isUnattempted = q.studentAnswer === undefined;

                                return (
                                    <div
                                        key={q.id}
                                        id={`question-${idx}`}
                                        className={cn(
                                            "mt-8 pt-8 first:mt-0 first:pt-0 border-t border-slate-800 first:border-0",
                                            // Highlight background slightly if incorrect? optional
                                        )}
                                    >
                                        <div className="flex gap-4 mb-6">
                                            <span className={cn(
                                                "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border font-bold",
                                                q.isCorrect ? "bg-green-500/10 border-green-500 text-green-500" :
                                                    isUnattempted ? "bg-slate-800 border-slate-700 text-slate-400" :
                                                        "bg-red-500/10 border-red-500 text-red-500"
                                            )}>
                                                {q.number}
                                            </span>
                                            <div className="flex-1">
                                                <div className="text-lg md:text-xl leading-relaxed text-slate-200">
                                                    <LatexRenderer text={q.text} />
                                                </div>
                                                <div className="mt-2 flex items-center gap-2 text-sm">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded font-medium",
                                                        q.isCorrect ? "bg-green-500/10 text-green-400" :
                                                            isUnattempted ? "bg-slate-800 text-slate-400" :
                                                                "bg-red-500/10 text-red-400"
                                                    )}>
                                                        {q.isCorrect ? 'Correct' : isUnattempted ? 'Unattempted' : 'Incorrect'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pl-0 md:pl-14">
                                            {options.map((opt, optIdx) => {
                                                const isCorrectOption = optIdx === q.correctAnswer;
                                                const isSelected = optIdx === q.studentAnswer;

                                                let optionClass = "bg-slate-900 border-slate-800 text-slate-400";

                                                if (isCorrectOption) {
                                                    optionClass = "bg-green-500/20 border-green-500/50 text-green-300 font-medium ring-1 ring-green-500/50";
                                                } else if (isSelected && !q.isCorrect) {
                                                    optionClass = "bg-red-500/20 border-red-500/50 text-red-300 ring-1 ring-red-500/50";
                                                } else if (isSelected) {
                                                    // Should not happen if correct is handled above, but for safety
                                                    optionClass = "bg-cyan-500/20 border-cyan-500/50 text-cyan-300";
                                                }

                                                return (
                                                    <div
                                                        key={optIdx}
                                                        className={cn(
                                                            "p-4 rounded-xl border flex items-center justify-between transition-all",
                                                            optionClass
                                                        )}
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className={cn(
                                                                "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                                isCorrectOption ? "border-green-500" :
                                                                    (isSelected && !q.isCorrect) ? "border-red-500" : "border-slate-600"
                                                            )}>
                                                                {(isCorrectOption || isSelected) && (
                                                                    <div className={cn(
                                                                        "w-2.5 h-2.5 rounded-full",
                                                                        isCorrectOption ? "bg-green-500" : "bg-red-500"
                                                                    )} />
                                                                )}
                                                            </div>
                                                            <span className="text-base leading-snug">
                                                                <LatexRenderer text={opt} />
                                                            </span>
                                                        </div>

                                                        {isCorrectOption && (
                                                            <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-green-500 uppercase px-2">
                                                                <CheckCircle size={14} /> Correct Answer
                                                            </span>
                                                        )}
                                                        {isSelected && !q.isCorrect && (
                                                            <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-red-500 uppercase px-2">
                                                                <XCircle size={14} /> Your Answer
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-12 mb-8 text-center md:hidden">
                            <Link href="/student" className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold transition-colors w-full inline-block">
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Sidebar */}
                <aside className={cn(
                    "absolute md:relative inset-y-0 right-0 w-80 bg-slate-900 border-l border-slate-800 transform transition-transform duration-300 ease-in-out z-10 flex flex-col",
                    isPaletteOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
                )}>
                    {/* Stats Legend - Mobile mostly, but good reference */}
                    <div className="p-4 border-b border-slate-800 bg-slate-950/50">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Question Legend</h3>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded bg-green-500"></span>
                                <span className="text-slate-300">Correct</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded bg-red-500"></span>
                                <span className="text-slate-300">Incorrect</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded bg-slate-700"></span>
                                <span className="text-slate-300">Unattempted</span>
                            </div>
                        </div>
                    </div>

                    {/* Question Grid */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-5 gap-2">
                            {data.analysis.map((q, idx) => {
                                const isUnattempted = q.studentAnswer === undefined;
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => scrollToQuestion(idx)}
                                        className={cn(
                                            "h-10 w-full rounded flex items-center justify-center font-medium transition-all hover:scale-105 active:scale-95",
                                            q.isCorrect ? "bg-green-500 text-white shadow-lg shadow-green-500/20" :
                                                isUnattempted ? "bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700" :
                                                    "bg-red-500 text-white shadow-lg shadow-red-500/20"
                                        )}
                                    >
                                        {q.number}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Score Card for Mobile Drawer */}
                    <div className="p-6 border-t border-slate-800 bg-slate-900 md:hidden">
                        <div className="text-center">
                            <div className="text-sm text-slate-400 mb-1">Total Score</div>
                            <div className="text-4xl font-bold text-cyan-400">{data.score}</div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
