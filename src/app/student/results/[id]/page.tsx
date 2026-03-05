'use client';
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, CheckCircle, XCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BlockMath } from 'react-katex';
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

// Renders a single line of text, passing it through LatexRenderer for math support
function TextWithLatex({ text, className }: { text: string; className?: string }) {
    return <LatexRenderer text={text} className={className} />;
}

// Renders one line, splitting on **bold** and passing each segment through LatexRenderer
function RenderLineWithLatex({ line, className = 'text-slate-300 text-sm leading-relaxed' }: { line: string; className?: string }) {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    if (parts.length > 1) {
        return (
            <span className={className}>
                {parts.map((part, j) =>
                    part.startsWith('**') && part.endsWith('**')
                        ? <strong key={j} className="text-slate-100 font-semibold"><TextWithLatex text={part.slice(2, -2)} /></strong>
                        : <TextWithLatex key={j} text={part} />
                )}
            </span>
        );
    }
    return <TextWithLatex text={line} className={className} />;
}

// Renders a block of plain text lines as markdown — supports headings, bullets, bold, LaTeX inline, and MD tables
function renderLines(lines: string[], keyOffset: number): React.ReactNode[] {
    // Helper: is this a separator row like |---|:---|
    const isSeparator = (row: string) =>
        row.replace(/\|/g, '').replace(/-/g, '').replace(/:/g, '').replace(/\s/g, '').length === 0;

    // Parse one | row into cells
    const parseCells = (row: string) =>
        row.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);

    // Group consecutive | lines into table blocks
    type Group = { type: 'table'; rows: string[] } | { type: 'line'; line: string };
    const groups: Group[] = [];
    let i = 0;
    while (i < lines.length) {
        if (lines[i].trim().startsWith('|')) {
            const tableRows: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                tableRows.push(lines[i]);
                i++;
            }
            groups.push({ type: 'table', rows: tableRows });
        } else {
            groups.push({ type: 'line', line: lines[i] });
            i++;
        }
    }

    let key = keyOffset;
    const elements: React.ReactNode[] = [];

    for (const group of groups) {
        if (group.type === 'table') {
            const contentRows = group.rows.filter(r => !isSeparator(r));
            if (contentRows.length === 0) continue;
            const [headerRow, ...bodyRows] = contentRows.map(parseCells);
            elements.push(
                <div key={key++} className="overflow-x-auto my-4 rounded-xl border border-slate-700 shadow-lg">
                    <table className="w-full text-xs border-collapse">
                        <thead>
                            <tr className="bg-blue-900/40 border-b border-slate-700">
                                {headerRow.map((cell, ci) => (
                                    <th key={ci} className="px-3 py-2.5 text-left text-cyan-200 font-semibold border-r border-slate-700 last:border-r-0 whitespace-nowrap">
                                        <RenderLineWithLatex line={cell} />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {bodyRows.map((row, ri) => (
                                <tr key={ri} className={cn('border-b border-slate-800 last:border-b-0', ri % 2 === 0 ? 'bg-slate-900/60' : 'bg-slate-800/30')}>
                                    {row.map((cell, ci) => (
                                        <td key={ci} className="px-3 py-2 text-slate-300 border-r border-slate-800 last:border-r-0 align-top">
                                            <RenderLineWithLatex line={cell} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            const line = group.line;
            const k = key++;
            if (line.startsWith('## ')) {
                elements.push(<h3 key={k} className="text-cyan-300 font-bold text-base mt-3 mb-1"><TextWithLatex text={line.slice(3)} /></h3>);
            } else if (line.startsWith('### ')) {
                elements.push(<h4 key={k} className="text-cyan-200 font-semibold text-sm mt-2 mb-0.5"><TextWithLatex text={line.slice(4)} /></h4>);
            } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
                elements.push(<p key={k} className="font-bold text-slate-200"><TextWithLatex text={line.slice(2, -2)} /></p>);
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                elements.push(<li key={k} className="text-slate-300 text-sm ml-4 list-disc leading-relaxed"><RenderLineWithLatex line={line.slice(2)} /></li>);
            } else if (line.startsWith('✅')) {
                elements.push(<p key={k} className="text-green-400 font-semibold text-sm mt-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2"><TextWithLatex text={line} /></p>);
            } else if (line.trim() === '') {
                elements.push(<div key={k} className="h-1" />);
            } else {
                elements.push(<p key={k} className="text-slate-300 text-sm leading-relaxed"><RenderLineWithLatex line={line} /></p>);
            }
        }
    }
    return elements;
}

// Splits text into segments: multi-line block math (\[...\] or $$...$$) vs plain text.
// This must happen BEFORE line-splitting so multi-line math isn't torn apart.
function segmentText(text: string): Array<{ type: 'block-math'; content: string } | { type: 'text'; content: string }> {
    const segments: Array<{ type: 'block-math'; content: string } | { type: 'text'; content: string }> = [];
    // Matches \[...\] or $$...$$ across newlines
    const blockRegex = /(\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = blockRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
        }
        // Strip delimiters to get raw LaTeX
        const raw = match[0];
        const inner = raw.startsWith('\\[') ? raw.slice(2, -2) : raw.slice(2, -2);
        segments.push({ type: 'block-math', content: inner.trim() });
        lastIndex = match.index + raw.length;
    }
    if (lastIndex < text.length) {
        segments.push({ type: 'text', content: text.slice(lastIndex) });
    }
    return segments;
}

// AI response markdown renderer — handles headings, bullets, bold, inline LaTeX, and multi-line block LaTeX
function AiMarkdown({ text }: { text: string }) {
    const segments = segmentText(text);
    let keyCounter = 0;
    const elements: React.ReactNode[] = [];

    for (const seg of segments) {
        if (seg.type === 'block-math') {
            elements.push(
                <div key={keyCounter++} className="my-3 overflow-x-auto text-center py-2 bg-slate-800/40 rounded-lg border border-slate-700/50">
                    <BlockMath>{seg.content}</BlockMath>
                </div>
            );
        } else {
            const lines = seg.content.split('\n');
            const rendered = renderLines(lines, keyCounter);
            keyCounter += lines.length;
            elements.push(...rendered);
        }
    }

    return <div className="space-y-1">{elements}</div>;
}

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const testId = resolvedParams.id;
    const router = useRouter();
    const [data, setData] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);

    // AI state per question
    const [aiResponses, setAiResponses] = useState<Record<string, string>>({});
    const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
    const [aiExpanded, setAiExpanded] = useState<Record<string, boolean>>({});

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
            setIsPaletteOpen(false);
        }
    };

    const askAI = async (q: QuestionAnalysis) => {
        if (aiLoading[q.id]) return;

        const options: string[] = JSON.parse(q.options);

        setAiLoading(prev => ({ ...prev, [q.id]: true }));
        setAiResponses(prev => ({ ...prev, [q.id]: '' }));
        setAiExpanded(prev => ({ ...prev, [q.id]: true }));

        try {
            const res = await fetch('/api/student/ai-question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: q.text,
                    options,
                    correctAnswer: q.correctAnswer,
                    studentAnswer: q.studentAnswer,
                    isCorrect: q.isCorrect,
                }),
            });

            if (!res.ok || !res.body) {
                setAiResponses(prev => ({ ...prev, [q.id]: 'Sorry, AI analysis failed. Please try again.' }));
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                setAiResponses(prev => ({ ...prev, [q.id]: (prev[q.id] || '') + chunk }));
            }
        } catch {
            setAiResponses(prev => ({ ...prev, [q.id]: 'Sorry, something went wrong. Please try again.' }));
        } finally {
            setAiLoading(prev => ({ ...prev, [q.id]: false }));
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
                    <div
                        className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
                    >
                        <div className="max-w-4xl mx-auto space-y-8">
                            {data.analysis.map((q, idx) => {
                                const options = JSON.parse(q.options) as string[];
                                const isUnattempted = q.studentAnswer === undefined;
                                const hasAiResponse = !!aiResponses[q.id];
                                const isAiLoading = aiLoading[q.id];
                                const isExpanded = aiExpanded[q.id];

                                return (
                                    <div
                                        key={q.id}
                                        id={`question-${idx}`}
                                        className="mt-8 pt-8 first:mt-0 first:pt-0 border-t border-slate-800 first:border-0"
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

                                        {/* AI Ask Button */}
                                        <div className="pl-0 md:pl-14 mt-4">
                                            <button
                                                onClick={() => {
                                                    if (hasAiResponse && !isAiLoading) {
                                                        setAiExpanded(prev => ({ ...prev, [q.id]: !isExpanded }));
                                                    } else {
                                                        askAI(q);
                                                    }
                                                }}
                                                disabled={isAiLoading}
                                                className={cn(
                                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                                                    isAiLoading
                                                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 cursor-wait"
                                                        : "bg-cyan-600/20 hover:bg-cyan-600/30 border-cyan-500/40 hover:border-cyan-500/70 text-cyan-300 hover:text-cyan-100 cursor-pointer"
                                                )}
                                            >
                                                <Sparkles size={15} className={cn(isAiLoading && "animate-pulse")} />
                                                {isAiLoading
                                                    ? 'AI is thinking...'
                                                    : hasAiResponse
                                                        ? isExpanded ? 'Hide AI Explanation' : 'Show AI Explanation'
                                                        : 'Ask AI'}
                                                {hasAiResponse && !isAiLoading && (
                                                    isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                                )}
                                            </button>

                                            {/* AI Response Panel */}
                                            {(isAiLoading || (hasAiResponse && isExpanded)) && (
                                                <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 overflow-hidden">
                                                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-cyan-500/20 bg-cyan-500/10">
                                                        <Sparkles size={14} className="text-cyan-400" />
                                                        <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">AI Explanation</span>
                                                    </div>
                                                    <div className="p-4">
                                                        {isAiLoading && !aiResponses[q.id] ? (
                                                            <div className="space-y-2 animate-pulse">
                                                                <div className="h-3 bg-cyan-500/20 rounded w-3/4"></div>
                                                                <div className="h-3 bg-cyan-500/20 rounded w-full"></div>
                                                                <div className="h-3 bg-cyan-500/20 rounded w-5/6"></div>
                                                            </div>
                                                        ) : (
                                                            <div className="relative">
                                                                <AiMarkdown text={aiResponses[q.id] || ''} />
                                                                {isAiLoading && (
                                                                    <span className="inline-block w-1.5 h-4 bg-cyan-400 animate-pulse ml-0.5 align-middle rounded-sm" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
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
                    {/* Stats Legend */}
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
