import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Test from '@/models/Test';
import User from '@/models/User';
import Attempt from '@/models/Attempt';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await props.params;
        const { answers, studentName } = await req.json();

        if (!studentName || !id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const user = await User.findOne({ username: studentName });

        if (!user) {
            return NextResponse.json({ error: 'User not found. Please login.' }, { status: 404 });
        }

        // Check if already attempted
        const existingAttempt = await Attempt.findOne({
            userId: user._id,
            testId: id
        });

        if (existingAttempt) {
            return NextResponse.json({ error: 'You have already attempted this test.' }, { status: 400 });
        }

        // Calculate Score
        const test = await Test.findById(id).lean();

        if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

        let score = 0;

        test.questions.forEach((question: any) => {
            const selectedOption = answers[question._id.toString()]; // Frontend sends questionId

            // If question was answered
            if (selectedOption !== undefined && selectedOption !== null) {
                // Warning: selectedOption might be string index
                if (Number(selectedOption) === question.correctAnswer) {
                    score += test.correctMarks;
                } else {
                    score += test.incorrectMarks;
                }
            }
        });

        const attempt = await Attempt.create({
            testId: id,
            userId: user._id,
            score,
            answers: JSON.stringify(answers)
        });

        return NextResponse.json({ success: true, score });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
    }
}
