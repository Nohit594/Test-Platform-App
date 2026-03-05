'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, X, BarChart2 } from 'lucide-react';
import LatexRenderer from '@/components/LatexRenderer';
import { BlockMath } from 'react-katex';


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

interface QuestionAnalysis {
    id: string;
    number: number;
    text: string;
    options: string;
    correctAnswer: number;
    studentAnswer: number | undefined;
    isCorrect: boolean;
}

// Renders text with bold splitting, each segment through LatexRenderer
function RenderLineLatex({ line, className = 'text-slate-300 text-sm leading-relaxed' }: { line: string; className?: string }) {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    if (parts.length > 1) {
        return (
            <span className={className}>
                {parts.map((part, j) =>
                    part.startsWith('**') && part.endsWith('**')
                        ? <strong key={j} className="text-slate-100 font-semibold"><LatexRenderer text={part.slice(2, -2)} /></strong>
                        : <LatexRenderer key={j} text={part} />
                )}
            </span>
        );
    }
    return <LatexRenderer text={line} className={className} />;
}

// AI markdown renderer for modal — supports tables, headings, bullets, bold, inline+block LaTeX
function AiMarkdown({ text }: { text: string }) {
    // Separator row check: |---|:---|
    const isSeparator = (row: string) =>
        row.replace(/\|/g, '').replace(/-/g, '').replace(/:/g, '').replace(/\s/g, '').length === 0;
    const parseCells = (row: string) =>
        row.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

    // Pre-extract multi-line block math (\[...\] or $$...$$) before anything else
    const mathSegments: Array<{ type: 'block-math' | 'text'; content: string }> = [];
    const blockRegex = /(\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$)/g;
    let lastIdx = 0;
    let m: RegExpExecArray | null;
    while ((m = blockRegex.exec(text)) !== null) {
        if (m.index > lastIdx) mathSegments.push({ type: 'text', content: text.slice(lastIdx, m.index) });
        const raw = m[0];
        mathSegments.push({ type: 'block-math', content: raw.slice(2, -2).trim() });
        lastIdx = m.index + raw.length;
    }
    if (lastIdx < text.length) mathSegments.push({ type: 'text', content: text.slice(lastIdx) });

    type Group = { type: 'table'; rows: string[] } | { type: 'line'; line: string } | { type: 'block-math'; content: string };
    const groups: Group[] = [];

    for (const seg of mathSegments) {
        if (seg.type === 'block-math') {
            groups.push({ type: 'block-math', content: seg.content });
        } else {
            const lines = seg.content.split('\n');
            let i = 0;
            while (i < lines.length) {
                if (lines[i].trim().startsWith('|')) {
                    const rows: string[] = [];
                    while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(lines[i]); i++; }
                    groups.push({ type: 'table', rows });
                } else {
                    groups.push({ type: 'line', line: lines[i] });
                    i++;
                }
            }
        }
    }

    return (
        <div className="space-y-1.5">
            {groups.map((group, gi) => {
                if (group.type === 'block-math') {
                    return (
                        <div key={gi} className="overflow-x-auto my-3 text-center py-2 bg-slate-800/40 rounded-lg border border-slate-700/50">
                            <BlockMath>{group.content}</BlockMath>
                        </div>
                    );
                }
                if (group.type === 'table') {
                    const contentRows = group.rows.filter(r => !isSeparator(r));
                    if (contentRows.length === 0) return null;
                    const [headerRow, ...bodyRows] = contentRows.map(parseCells);
                    return (
                        <div key={gi} className="overflow-x-auto my-4 rounded-xl border border-slate-700 shadow-lg">
                            <table className="w-full text-xs border-collapse">
                                <thead>
                                    <tr className="bg-blue-900/40 border-b border-slate-700">
                                        {headerRow.map((cell, ci) => (
                                            <th key={ci} className="px-3 py-2.5 text-left text-cyan-200 font-semibold border-r border-slate-700 last:border-r-0 whitespace-nowrap">
                                                <RenderLineLatex line={cell} />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {bodyRows.map((row, ri) => (
                                        <tr key={ri} className={`border-b border-slate-800 last:border-b-0 ${ri % 2 === 0 ? 'bg-slate-900/60' : 'bg-slate-800/30'}`}>
                                            {row.map((cell, ci) => (
                                                <td key={ci} className="px-3 py-2 text-slate-300 border-r border-slate-800 last:border-r-0 align-top">
                                                    <RenderLineLatex line={cell} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                }
                // Single line
                const line = group.line;
                if (line.startsWith('## ')) return <h3 key={gi} className="text-cyan-300 font-bold text-base mt-4 mb-1"><LatexRenderer text={line.slice(3)} /></h3>;
                if (line.startsWith('# ')) return <h2 key={gi} className="text-white font-bold text-lg mt-4 mb-1"><LatexRenderer text={line.slice(2)} /></h2>;
                if (line.startsWith('- ') || line.startsWith('* ')) return <li key={gi} className="text-slate-300 text-sm ml-5 list-disc leading-relaxed"><RenderLineLatex line={line.slice(2)} /></li>;
                if (line.trim() === '') return <div key={gi} className="h-1.5" />;
                return <p key={gi} className="text-slate-300 text-sm leading-relaxed"><RenderLineLatex line={line} /></p>;
            })}
        </div>
    );
}

export default function StudentDashboard() {
    const [name, setName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(false);
    const [inProgressTests, setInProgressTests] = useState<Set<string>>(new Set());
    const router = useRouter();

    // AI Paper Analysis Modal State
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [aiModalTitle, setAiModalTitle] = useState('');
    const [aiModalContent, setAiModalContent] = useState('');
    const [aiModalLoading, setAiModalLoading] = useState(false);
    const [aiModalError, setAiModalError] = useState('');

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
                    if (user.role === 'ADMIN') {
                        // allowed
                    } else {
                        router.push('/login');
                    }
                }
                setName(user.name);
                setIsAuthenticated(true);
                fetchDashboard(user.username);
            } catch {
                localStorage.removeItem('user');
                router.push('/login');
            }
        };
        checkAuth();
    }, [router]);

    useEffect(() => {
        const studentName = localStorage.getItem('studentName');
        if (!studentName) return;

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
    }, [tests]);

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
        localStorage.removeItem('studentName');
        setIsAuthenticated(false);
        router.push('/login');
    };

    const openAiPaperAnalysis = useCallback(async (test: Test) => {
        const studentName = localStorage.getItem('studentName') || localStorage.getItem('user')
            ? (() => { try { return JSON.parse(localStorage.getItem('user')!).username; } catch { return null; } })()
            : null;

        if (!studentName) return;

        setAiModalTitle(test.title);
        setAiModalContent('');
        setAiModalError('');
        setAiModalLoading(true);
        setAiModalOpen(true);

        try {
            // Fetch the results first
            const res = await fetch(`/api/student/results/${test.id}?name=${encodeURIComponent(studentName)}`);
            if (!res.ok) {
                setAiModalError('Could not load test data. Please try again.');
                setAiModalLoading(false);
                return;
            }
            const data = await res.json();
            const analysis: QuestionAnalysis[] = data.analysis;
            const attemptId = data.attemptId;

            // Stream AI paper analysis
            const aiRes = await fetch('/api/student/ai-paper-analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attemptId, testTitle: test.title, analysis }),
            });

            if (!aiRes.ok || !aiRes.body) {
                setAiModalError('AI analysis failed. Please try again.');
                setAiModalLoading(false);
                return;
            }

            const reader = aiRes.body.getReader();
            const decoder = new TextDecoder();
            setAiModalLoading(false);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                setAiModalContent(prev => prev + chunk);
            }
        } catch {
            setAiModalError('Something went wrong. Please try again.');
            setAiModalLoading(false);
        }
    }, []);

    const closeModal = () => {
        setAiModalOpen(false);
        setAiModalContent('');
        setAiModalError('');
        setAiModalLoading(false);
    };

    if (!isAuthenticated) {
        return null;
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
                            <div key={test.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 hover:border-slate-700 transition-all">
                                <div className="w-full md:w-auto">
                                    <h3 className="text-xl font-bold mb-1">{test.title}</h3>
                                    <div className="flex gap-4 text-sm text-slate-400">
                                        <span>{test.questionCount} Questions</span>
                                        <span>•</span>
                                        <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto mt-2 md:mt-0">
                                    {test.attempt ? (
                                        <div className="text-left md:text-right">
                                            <div className="inline-block px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-medium text-sm sm:text-base">
                                                Submitted
                                            </div>
                                            {test.showResults ? (
                                                <div className="mt-3 space-y-3 md:space-y-2">
                                                    <div className="text-cyan-400 font-bold mb-1">Score: {test.attempt.score}</div>
                                                    <div className="flex flex-col sm:flex-row gap-2 justify-start md:justify-end w-full">
                                                        <Link
                                                            href={`/student/results/${test.id}`}
                                                            className="flex items-center justify-center gap-1.5 px-4 py-2 sm:px-3 sm:py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600/70 text-slate-300 hover:text-white text-sm font-medium rounded-lg transition-all w-full sm:w-auto"
                                                        >
                                                            <BarChart2 size={16} className="sm:w-[13px] sm:h-[13px]" />
                                                            View Analysis
                                                        </Link>
                                                        <button
                                                            onClick={() => openAiPaperAnalysis(test)}
                                                            className="flex items-center justify-center gap-1.5 px-4 py-2 sm:px-3 sm:py-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/40 hover:border-cyan-500/70 text-cyan-300 hover:text-cyan-100 text-sm font-medium rounded-lg transition-all w-full sm:w-auto"
                                                        >
                                                            <Sparkles size={16} className="sm:w-[13px] sm:h-[13px]" />
                                                            Analyze with AI
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-2 text-slate-500 text-sm italic">Results pending</div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={`/student/test/${test.id}`}
                                            className={`flex items-center justify-center w-full md:w-auto px-8 py-3 font-bold rounded-lg shadow-lg transition-all text-white ${inProgressTests.has(test.id)
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

            {/* AI Paper Analysis Modal */}
            {aiModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Modal */}
                    <div className="relative w-[calc(100%-2rem)] max-w-3xl max-h-[85vh] m-4 bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-purple-900/30 flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-blue-900/40 to-slate-900 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                                    <Sparkles size={18} className="text-cyan-300" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white text-base">AI Paper Analysis</h2>
                                    <p className="text-xs text-cyan-300/70 truncate max-w-xs">{aiModalTitle}</p>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            {aiModalLoading && (
                                <div className="flex flex-col items-center justify-center py-16 gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-purple-500 animate-spin" />
                                        <Sparkles size={18} className="absolute inset-0 m-auto text-cyan-400" />
                                    </div>
                                    <p className="text-slate-400 text-sm animate-pulse">AI is analyzing your paper...</p>
                                </div>
                            )}

                            {aiModalError && (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <p className="text-red-400 text-sm">{aiModalError}</p>
                                    <button
                                        onClick={closeModal}
                                        className="text-xs text-slate-400 hover:text-white underline"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}

                            {!aiModalLoading && !aiModalError && (
                                <div className="relative">
                                    <AiMarkdown text={aiModalContent} />
                                    {aiModalContent && !aiModalLoading && (
                                        // blinking cursor while streaming  
                                        <span className="inline-block w-1.5 h-4 bg-cyan-400 animate-pulse ml-0.5 align-middle rounded-sm" />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {!aiModalLoading && !aiModalError && aiModalContent && (
                            <div className="px-6 py-3 border-t border-slate-800 shrink-0 flex justify-between items-center bg-slate-900/50">
                                <p className="text-xs text-slate-500">Generated by AI — use as a learning guide</p>
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
