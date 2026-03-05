import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Attempt from '@/models/Attempt';

export const dynamic = 'force-dynamic';

interface QuestionData {
    number: number;
    text: string;
    options: string;
    correctAnswer: number;
    studentAnswer: number | undefined;
    isCorrect: boolean;
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { attemptId, testTitle, analysis }: { attemptId: string; testTitle: string; analysis: QuestionData[] } = await req.json();

        // 1. Check if we already generated analysis for this attempt
        if (attemptId) {
            const existingAttempt = await Attempt.findById(attemptId).lean();
            if (existingAttempt?.aiAnalysis) {
                // Instantly stream the saved analysis
                const { readable, writable } = new TransformStream();
                const writer = writable.getWriter();
                const encoder = new TextEncoder();
                writer.write(encoder.encode(existingAttempt.aiAnalysis));
                writer.close();
                return new Response(readable, {
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8',
                        'Transfer-Encoding': 'chunked',
                    },
                });
            }
        }

        const totalQuestions = analysis.length;
        const correctCount = analysis.filter(q => q.isCorrect).length;
        const incorrectCount = analysis.filter(q => q.studentAnswer !== undefined && !q.isCorrect).length;
        const unattemptedCount = analysis.filter(q => q.studentAnswer === undefined).length;

        const wrongQuestions = analysis
            .filter(q => !q.isCorrect)
            .map(q => {
                const options: string[] = JSON.parse(q.options);
                const correctText = options[q.correctAnswer];
                const studentText = q.studentAnswer !== undefined ? options[q.studentAnswer] : 'Not attempted';
                return `Q${q.number}: ${q.text}
  Correct: ${correctText}
  Student answered: ${studentText}`;
            });

        const prompt = `You are an expert academic mentor analyzing a student's test performance to help them improve.

**Test:** ${testTitle}
**Performance Summary:**
- Total Questions: ${totalQuestions}
- Correct: ${correctCount}
- Incorrect: ${incorrectCount}  
- Unattempted: ${unattemptedCount}
- Score: ${Math.round((correctCount / totalQuestions) * 100)}%

**Questions the student got wrong or did not attempt:**
${wrongQuestions.length > 0 ? wrongQuestions.join('\n\n') : 'None — the student got all questions correct!'}

Based on this data, provide a comprehensive but concise performance analysis with the following structure:

## 📊 Performance Overview
Give a 2-3 sentence summary of overall performance with an encouraging tone.

## 🔍 Weak Areas Identified
List the specific topics/concepts/subject areas where the student struggled (inferred from the wrong questions). Group related mistakes together. Be specific about the concept (e.g., "Quadratic Equations", not just "Math").

## 📚 Improvement Roadmap
For each weak area identified, give:
- **[Topic Name]**: One specific, actionable study tip (e.g., "Practice factoring problems", "Review Newton's Third Law with real-world examples").

## 💪 Strengths to Build On
Briefly mention 1-2 things the student appears to understand well (from correct answers, if any).

## 🎯 Priority Action Items
List 3-5 concrete next steps the student should take, ordered by priority.

Keep the tone positive, constructive, and motivating. Use markdown formatting.`;

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
        }

        const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'X-Title': 'Student Test Paper Analysis',
            },
            body: JSON.stringify({
                model: 'nvidia/nemotron-3-nano-30b-a3b:free',
                messages: [{ role: 'user', content: prompt }],
                stream: true,
            }),
        });

        if (!openRouterRes.ok) {
            const errText = await openRouterRes.text();
            console.error('OpenRouter error:', errText);
            return NextResponse.json({ error: 'AI service error' }, { status: 502 });
        }

        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        (async () => {
            let fullResponseText = '';
            try {
                const reader = openRouterRes.body!.getReader();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') continue;
                            try {
                                const parsed = JSON.parse(data);
                                const content = parsed.choices?.[0]?.delta?.content;
                                if (content) {
                                    fullResponseText += content;
                                    await writer.write(encoder.encode(content));
                                }
                            } catch { }
                        }
                    }
                }
            } finally {
                await writer.close();
                // Save the generated analysis to the database for future views
                if (attemptId && fullResponseText) {
                    await Attempt.findByIdAndUpdate(attemptId, { aiAnalysis: fullResponseText }).catch(err => {
                        console.error('Failed to save AI analysis to DB:', err);
                    });
                }
            }
        })();

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });
    } catch (error) {
        console.error('AI paper analyze route error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
