import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Attempt from '@/models/Attempt';
import Test from '@/models/Test';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const { id: testId } = params;

    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    try {
        await dbConnect();

        const user = await User.findOne({ username: name });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // populate test details
        const attempt = await Attempt.findOne({
            userId: user._id,
            testId
        });

        if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });

        // Manual populate or query because testId is Ref
        const test = await Test.findById(testId).lean();

        if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

        if (!test.showResults) {
            return NextResponse.json({ error: 'Results are not released yet' }, { status: 403 });
        }

        // Parse answers
        const studentAnswers = JSON.parse(attempt.answers);

        // Construct response with full analysis
        const analysis = test.questions.map((q: any) => ({
            id: q._id.toString(),
            number: q.number,
            text: q.text,
            options: q.options, // JSON string
            correctAnswer: q.correctAnswer,
            studentAnswer: studentAnswers[q._id.toString()],
            isCorrect: Number(studentAnswers[q._id.toString()]) === q.correctAnswer
        }));

        return NextResponse.json({
            testTitle: test.title,
            score: attempt.score,
            totalQuestions: test.questions.length,
            analysis
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
    }
}
