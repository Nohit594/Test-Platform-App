import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { question, options, correctAnswer, studentAnswer, isCorrect } = await req.json();

        const correctOptionText = options[correctAnswer];
        const studentOptionText = studentAnswer !== undefined ? options[studentAnswer] : null;

        let prompt = `You are an expert tutor helping a student understand a multiple-choice question from their test.

Question: ${question}

Options:
${options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}) ${opt}`).join('\n')}

Correct Answer: ${String.fromCharCode(65 + correctAnswer)}) ${correctOptionText}
${studentAnswer !== undefined ? `Student's Answer: ${String.fromCharCode(65 + studentAnswer)}) ${studentOptionText}` : `Student's Answer: Not attempted`}
Student was: ${isCorrect ? 'CORRECT' : 'INCORRECT'}

Please provide a clear explanation with the following structure:
1. **Why the correct answer is right**: Explain the concept behind the correct answer in 2-3 sentences.
2. **Common misconception**: ${!isCorrect ? `Explain why "${studentOptionText}" is incorrect and what misunderstanding it represents.` : `Briefly note a common trap students fall into with this type of question.`}
3. **Topic/Area to Study**: Name the specific topic or concept area this question tests (e.g., "Photosynthesis", "Newton's Laws", "Algebra - Quadratic Equations", etc.).
4. **Quick Tip**: Give one actionable study tip for this topic.

${isCorrect ? `End your response with exactly this line on a new paragraph: "✅ You answered correctly! You have a good understanding of this concept. Keep it up!"` : ''}

Keep your response concise, focused, and encouraging. Use markdown formatting.`;

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
        }

        const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'X-Title': 'Student Test Analysis',
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

        // Stream directly back to client
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        (async () => {
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
                                    await writer.write(encoder.encode(content));
                                }
                            } catch { }
                        }
                    }
                }
            } finally {
                await writer.close();
            }
        })();

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });
    } catch (error) {
        console.error('AI question route error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
