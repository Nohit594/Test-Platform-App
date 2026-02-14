'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, ChevronDown, ChevronUp, Bot, FileText } from 'lucide-react';

export default function CreateTestPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        rawJson: '',
        correctMarks: 4,
        incorrectMarks: -1,
        duration: 180,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isPromptOpen, setIsPromptOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const copyToClipboard = async () => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(AI_PROMPT);
            } else {
                // Fallback for environments where Clipboard API is not available
                const textArea = document.createElement("textarea");
                textArea.value = AI_PROMPT;
                textArea.style.position = "fixed";  // Avoid scrolling to bottom
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                    throw err;
                }
                document.body.removeChild(textArea);
            }
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate JSON before sending
            try {
                JSON.parse(formData.rawJson);
            } catch (err: any) {
                throw new Error(`Invalid JSON format: ${err.message}`);
            }

            const res = await fetch('/api/tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to create test');

            router.push('/admin');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-cyan-400">Create New Test</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-slate-300 font-medium">Test Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="e.g. Weekly Assessment 1"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="block text-slate-300 font-medium">Correct Marks</label>
                            <input
                                type="number"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500"
                                value={formData.correctMarks}
                                onChange={(e) => setFormData({ ...formData, correctMarks: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-slate-300 font-medium">Incorrect Marks</label>
                            <input
                                type="number"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500"
                                value={formData.incorrectMarks}
                                onChange={(e) => setFormData({ ...formData, incorrectMarks: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-slate-300 font-medium">Duration (mins)</label>
                            <input
                                type="number"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden transition-all duration-300 mb-6">
                        <button
                            type="button"
                            onClick={() => setIsPromptOpen(!isPromptOpen)}
                            className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800 transition-colors"
                        >
                            <div className="flex items-center gap-2 text-cyan-400 font-medium">
                                <Bot className="w-5 h-5" />
                                <span>AI Prompt for Question Generation</span>
                            </div>
                            {isPromptOpen ? (
                                <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                        </button>

                        {isPromptOpen && (
                            <div className="p-4 border-t border-slate-700/50 bg-slate-950">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-slate-400">
                                        Copy this prompt and use it with any AI (ChatGPT, Claude, Gemini) to convert your exam questions into the required JSON format.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={copyToClipboard}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${copySuccess
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                                            }`}
                                    >
                                        {copySuccess ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                Copy Prompt
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 p-2">
                                        <FileText className="w-4 h-4 text-slate-600" />
                                    </div>
                                    <pre className="w-full h-64 p-4 text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 rounded-lg overflow-y-auto whitespace-pre-wrap">
                                        {AI_PROMPT}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-slate-300 font-medium">
                            Questions JSON
                            <span className="text-slate-500 text-sm ml-2 font-normal">(Paste your JSON here)</span>
                        </label>
                        <textarea
                            required
                            rows={15}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm focus:outline-none focus:border-cyan-500"
                            placeholder='[
  {
    "number": 1,
    "text": "Question text...",
    "options": ["(1) ...", "(2) ..."],
    "correctAnswer": 0
  }
]'
                            value={formData.rawJson}
                            onChange={(e) => setFormData({ ...formData, rawJson: e.target.value })}
                        />
                        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${loading
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/20'
                                }`}
                        >
                            {loading ? 'Creating...' : 'Create Test'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const AI_PROMPT = `You are an exam-content conversion AI.

The workflow has TWO MANDATORY STEPS.

================================================
STEP 1: IMAGE DETECTION (NO JSON YET)
================================================

Input: A PDF (or extracted text) of MCQs.

Your first task is to ANALYZE the questions and identify
which question numbers REQUIRE images/figures/diagrams
to be complete.

• Do NOT convert questions to JSON in this step.
• Do NOT guess images.
• Only detect questions that explicitly reference:
  - figure
  - diagram
  - graph
  - circuit
  - shown in the figure
  - see the figure below
  - or visibly missing content

OUTPUT FORMAT (STEP 1 ONLY):

Return ONLY a plain text list in this exact format:

Questions with images required:
Q3
Q6
Q9
Q14

================================================
WAIT FOR USER INPUT
================================================

The user will then provide image URLs mapped to
question numbers, for example:

3 https://i.ibb.co/xSgKR3Kn/Whats-App-Image-2025-07-23-at-09-09-05-4d81317d.jpg
6 https://i.ibb.co/xxxx/image2.jpg

================================================
STEP 2: FINAL JSON CONVERSION
================================================

After receiving image URLs, convert ALL MCQs into
CBT-ready JSON.

====================
JSON FORMAT
====================

Return ONLY valid JSON.
No explanations or markdown.

Each question object MUST contain:

1. "number" → sequential integer
2. "text" → full question text
3. "options" → array with original numbering "(1)", "(2)", "(3)", "(4)"
4. "correctAnswer" → 0-based index or null

====================
IMAGE INSERTION RULE
====================

• If an image URL is provided for a question number,
  embed it INSIDE the question text using:

  <img src="IMAGE_URL">

• Place the image at the END of the question text,
  before options begin.

• Do NOT embed images for questions not listed.

• **IMAGE OPTIONS**:
  If the options themselves are images (e.g., Figures A, B, C, D),
  do NOT describe them. Instead, output the text options exactly as:
  "(1) Option A", "(2) Option B", "(3) Option C", "(4) Option D".
  Do NOT attempt to describe the visual content of the options.

====================
LATEX & MATH FORMATTING (CRITICAL)
====================

• Because this is JSON, you MUST double-escape all backslashes.
• Use \\( ... \\) for inline math.
• Use \\mathrm{...}, \\text{...}, etc.
• Example: "Mass is \\(50\\mathrm{kg}\\)" (Correct)
• WRONG: "Mass is \(50\mathrm{kg}\)" (Invalid JSON)

====================
FORMATTING RULES
====================

• Use <br> for:
  - multi-part questions
  - assertion–reason
  - List-I / List-II
  - passages

• Preserve underlined words using:
  <u>text</u>

• Do NOT repeat option text in question stem.
• Do NOT reorder options.
• Do NOT skip any question.

====================
SPECIAL CASES
====================

• Passage-based questions → include full passage
• Matching questions → single JSON object
• Assertion–Reason → formatted with <br>

====================
FINAL VALIDATION
====================

✔ All questions included
✔ Images embedded only where user provided URLs
✔ JSON valid and CBT-ready
✔ correctAnswer is 0-based
✔ No hallucination

====================
START STEP 1 NOW
====================


before the Question JSON as an instruction to paste in any ai`;
