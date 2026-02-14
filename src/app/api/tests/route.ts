import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Test from '@/models/Test';
import User from '@/models/User';
import TestAssignment from '@/models/TestAssignment';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { title, rawJson, correctMarks, incorrectMarks, duration } = body;

        let questionsData;
        try {
            questionsData = JSON.parse(rawJson);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
        }

        if (!Array.isArray(questionsData)) {
            questionsData = [questionsData];
        }

        // Basic validation of question structure
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const questions = questionsData.map((q: any) => ({
            number: q.number || 0,
            text: q.text || '',
            options: JSON.stringify(q.options || []),
            correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        }));

        const test = await Test.create({
            title: title || 'Untitled Test',
            correctMarks: Number(correctMarks) || 4,
            incorrectMarks: Number(incorrectMarks) || -1,
            duration: Number(duration) || 180,
            questions: questions,
        });

        return NextResponse.json({ success: true, testId: test._id });
    } catch (error) {
        console.error('Error creating test:', error);
        return NextResponse.json({ error: 'Failed to create test' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    try {
        await dbConnect();
        let filter: any = {};

        if (username) {
            const user = await User.findOne({ username });
            if (user && user.role === 'STUDENT') {
                // Find assignments for this user
                const assignments = await TestAssignment.find({ userId: user._id });
                const assignedTestIds = assignments.map((a: any) => a.testId);

                filter = {
                    isActive: true,
                    _id: { $in: assignedTestIds }
                };
            }
        }

        const tests = await Test.find(filter).sort({ createdAt: -1 });

        // Format for frontend (add question count)
        const formattedTests = tests.map((t: any) => ({
            id: t._id.toString(),
            title: t.title,
            createdAt: t.createdAt,
            correctMarks: t.correctMarks,
            incorrectMarks: t.incorrectMarks,
            duration: t.duration,
            isActive: t.isActive,
            showResults: t.showResults,
            _count: { questions: t.questions.length }
        }));

        return NextResponse.json(formattedTests);
    } catch (error) {
        console.error('Failed to fetch tests:', error);
        return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 });
    }
}
