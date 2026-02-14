'use client';
import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle, HelpCircle, Bookmark, Menu } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import LatexRenderer from '@/components/LatexRenderer';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Question {
    id: string;
    number: number;
    text: string;
    options: string; // JSON string
}

interface TestData {
    id: string;
    title: string;
    duration: number;
    questions: Question[];
}

export default function TestPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const testId = resolvedParams.id;

    // Data State
    const [test, setTest] = useState<TestData | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Test State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
    const [visited, setVisited] = useState<Set<string>>(new Set());

    // Timer State
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPaletteOpen, setIsPaletteOpen] = useState(false); // Mobile drawer

    // Load Test
    useEffect(() => {
        const studentName = localStorage.getItem('studentName');
        if (!studentName) {
            router.push('/student');
            return;
        }

        fetch(`/api/tests/${testId}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load test');
                return res.json();
            })
            .then(data => {
                setTest(data);
                if (data.duration) setTimeLeft(data.duration * 60);
                // Mark first question as visited
                if (data.questions.length > 0) {
                    setVisited(new Set([data.questions[0].id]));
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                router.push('/student');
            });
    }, [testId, router]);

    // Timer Logic
    useEffect(() => {
        if (!test || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true); // Auto-submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [test, timeLeft]); // submit dependency handled via ref or simple function

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (optionIndex: number) => {
        if (!test) return;
        const qId = test.questions[currentQuestionIndex].id;
        setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
    };

    const getQuestionStatus = (qId: string) => {
        const isAnswered = answers[qId] !== undefined;
        const isMarked = markedForReview.has(qId);
        const isVisited = visited.has(qId);
        const isCurrent = test?.questions[currentQuestionIndex].id === qId;

        if (isCurrent) return 'current';
        if (isAnswered && isMarked) return 'marked_answered';
        if (isMarked) return 'marked';
        if (isAnswered) return 'answered';
        if (isVisited && !isAnswered) return 'not_answered';
        return 'not_visited';
    };

    const navigateToQuestion = (index: number) => {
        if (!test) return;
        setVisited(prev => new Set(prev).add(test.questions[index].id));
        setCurrentQuestionIndex(index);
        setIsPaletteOpen(false); // Close drawer on mobile
    };

    const handleNext = () => {
        if (!test || currentQuestionIndex >= test.questions.length - 1) return;
        navigateToQuestion(currentQuestionIndex + 1);
    };

    const handlePrevious = () => {
        if (currentQuestionIndex <= 0) return;
        navigateToQuestion(currentQuestionIndex - 1);
    };

    const handleClearResponse = () => {
        if (!test) return;
        const qId = test.questions[currentQuestionIndex].id;
        setAnswers(prev => {
            const next = { ...prev };
            delete next[qId];
            return next;
        });
    };

    const handleMarkForReview = () => {
        if (!test) return;
        const qId = test.questions[currentQuestionIndex].id;
        setMarkedForReview(prev => {
            const next = new Set(prev);
            if (next.has(qId)) next.delete(qId);
            else next.add(qId);
            return next;
        });
        handleNext();
    };

    const handleSaveAndNext = () => {
        // Just next, as selecting an option already "saves" to state
        // If not marked for review, ensure it's removed from marked
        if (!test) return;
        const qId = test.questions[currentQuestionIndex].id;
        setMarkedForReview(prev => {
            const next = new Set(prev);
            next.delete(qId);
            return next;
        });
        handleNext();
    };

    const handleSubmit = async (auto = false) => {
        if (!auto && !confirm('Are you sure you want to submit?')) return;

        setSubmitting(true);
        const studentName = localStorage.getItem('studentName');

        try {
            const res = await fetch(`/api/tests/${testId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers,
                    studentName
                }),
            });

            const data = await res.json();
            if (res.ok) {
                if (!auto) alert('Test Submitted Successfully!');
                router.push('/student');
            } else {
                alert(data.error || 'Submission failed');
            }
        } catch (err) {
            alert('Error submitting test');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading Test...</div>;
    if (!test) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-500">Test not found</div>;

    const currentQuestion = test.questions[currentQuestionIndex];
    const currentOptions = JSON.parse(currentQuestion.options) as string[];

    return (
        <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden font-sans">
            {/* Header */}
            <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 truncate max-w-md">
                        {test.title}
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className={cn("hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full border",
                        timeLeft < 300 ? "bg-red-500/10 border-red-500/50 text-red-400 animate-pulse" : "bg-slate-800 border-slate-700 text-cyan-400"
                    )}>
                        <Clock className="w-4 h-4" />
                        <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
                    </div>
                    <button
                        className="md:hidden p-2 text-slate-400"
                        onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                    >
                        <Menu size={24} />
                    </button>
                    <button
                        onClick={() => handleSubmit()}
                        disabled={submitting}
                        className="hidden md:block px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/20 transition-all"
                    >
                        {submitting ? 'Submitting...' : 'Submit Test'}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Question Area */}
                <main className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Question Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <div className="flex gap-4">
                                <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 font-bold">
                                    {currentQuestion.number}
                                </span>
                                <div className="text-lg md:text-xl leading-relaxed text-slate-200 pt-1.5">
                                    <LatexRenderer text={currentQuestion.text} />
                                </div>
                            </div>

                            <div className="space-y-3 pl-0 md:pl-14">
                                {currentOptions.map((opt, idx) => {
                                    const isSelected = answers[currentQuestion.id] === idx;
                                    return (
                                        <label
                                            key={idx}
                                            className={cn(
                                                "flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 group",
                                                isSelected
                                                    ? "bg-cyan-500/10 border-cyan-500"
                                                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                                            )}
                                        >
                                            <div className={cn(
                                                "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                                isSelected ? "border-cyan-500" : "border-slate-600 group-hover:border-slate-500"
                                            )}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />}
                                            </div>
                                            <span className="text-slate-300 text-lg leading-snug select-none">
                                                <LatexRenderer text={opt} />
                                            </span>
                                            <input
                                                type="radio"
                                                name={currentQuestion.id}
                                                className="hidden"
                                                checked={isSelected}
                                                onChange={() => handleOptionSelect(idx)}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Toolbar */}
                    <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6 shrink-0">
                        <div className="flex gap-3">
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft size={18} />
                                <span className="hidden sm:inline">Previous</span>
                            </button>
                            <button
                                onClick={handleClearResponse}
                                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-colors"
                            >
                                Clear
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleMarkForReview}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                            >
                                <Bookmark size={18} />
                                <span className="hidden sm:inline">Mark for Review & Next</span>
                            </button>
                            <button
                                onClick={handleSaveAndNext}
                                className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/20 transition-all"
                            >
                                <span className="hidden sm:inline">Save & Next</span>
                                <span className="sm:hidden">Next</span>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Question Palette Sidebar */}
                <aside className={cn(
                    "absolute md:relative inset-y-0 right-0 w-80 bg-slate-900 border-l border-slate-800 transform transition-transform duration-300 ease-in-out z-10 flex flex-col",
                    isPaletteOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
                )}>
                    {/* User Info */}
                    <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-800/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                            S
                        </div>
                        <div>
                            <div className="text-white font-medium">Student</div>
                            <div className="text-xs text-slate-400">Candidate</div>
                        </div>
                    </div>

                    {/* Stats Legend */}
                    <div className="p-4 grid grid-cols-2 gap-3 text-xs border-b border-slate-800 bg-slate-900">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center text-white">1</div>
                            <span className="text-slate-400">Answered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-red-500/20 border border-red-500 text-red-500 flex items-center justify-center">2</div>
                            <span className="text-slate-400">Not Answered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-slate-800 border border-slate-600 text-slate-400 flex items-center justify-center">3</div>
                            <span className="text-slate-400">Not Visited</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center text-white">4</div>
                            <span className="text-slate-400">Marked for Review</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                            <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center text-white relative">
                                5
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                            </div>
                            <span className="text-slate-400">Ans & Marked for Review</span>
                        </div>
                    </div>

                    {/* Palette Grid */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-5 gap-2">
                            {test.questions.map((q, idx) => {
                                const status = getQuestionStatus(q.id);
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => navigateToQuestion(idx)}
                                        className={cn(
                                            "h-10 w-full rounded flex items-center justify-center font-medium transition-all relative",
                                            status === 'current' && "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900 z-10",
                                            status === 'answered' && "bg-green-500 text-white hover:bg-green-600",
                                            status === 'not_answered' && "bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500/30",
                                            status === 'not_visited' && "bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700",
                                            status === 'marked' && "bg-purple-500 text-white hover:bg-purple-600",
                                            status === 'marked_answered' && "bg-purple-500 text-white hover:bg-purple-600"
                                        )}
                                    >
                                        {idx + 1}
                                        {status === 'marked_answered' && (
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Submit */}
                    <div className="p-4 border-t border-slate-800 md:hidden">
                        <button
                            onClick={() => handleSubmit()}
                            disabled={submitting}
                            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg"
                        >
                            {submitting ? 'Submitting...' : 'Submit Test'}
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
