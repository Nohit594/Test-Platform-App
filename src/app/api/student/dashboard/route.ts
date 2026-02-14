import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Test from '@/models/Test';
import TestAssignment from '@/models/TestAssignment';
import Attempt from '@/models/Attempt';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    try {
        await dbConnect();

        const user = await User.findOne({ username: name });
        if (!user) {
            // If user somehow doesn't exist but has name... return empty
            return NextResponse.json({ tests: [] });
        }

        // 1. Get assignments
        const assignments = await TestAssignment.find({ userId: user._id });
        const assignedTestIds = assignments.map((a: any) => a.testId);

        // 2. Get Tests
        const tests = await Test.find({
            isActive: true,
            _id: { $in: assignedTestIds }
        }).sort({ createdAt: -1 }).lean();

        // 3. Get Attempts for this user matching these tests
        const attempts = await Attempt.find({
            userId: user._id,
            testId: { $in: assignedTestIds }
        });

        // 4. Map together
        const formattedTests = tests.map((test: any) => {
            const userAttempt = attempts.find((a: any) => a.testId.toString() === test._id.toString());

            return {
                id: test._id.toString(),
                title: test.title,
                questionCount: test.questions ? test.questions.length : 0,
                createdAt: test.createdAt,
                isActive: test.isActive,
                showResults: test.showResults,
                attempt: userAttempt ? {
                    id: userAttempt._id.toString(),
                    score: userAttempt.score,
                    createdAt: userAttempt.createdAt
                } : null
            };
        });

        return NextResponse.json({ tests: formattedTests });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
    }
}
