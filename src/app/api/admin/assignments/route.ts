import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import TestAssignment from '@/models/TestAssignment';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { testId, userIds } = body;

        if (!testId || !userIds || !Array.isArray(userIds)) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        // Create multiple assignments using Promise.all for concurrency
        // Upsert logic: if exists, do nothing (or update timestamp), if not, create.
        const operations = userIds.map((userId: string) =>
            TestAssignment.findOneAndUpdate(
                { testId, userId },
                { testId, userId, assignedAt: new Date() },
                { upsert: true, new: true }
            )
        );

        await Promise.all(operations);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to assign test:', error);
        return NextResponse.json({ error: 'Failed to assign test' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { testId, userId } = body;

        if (!testId || !userId) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        await TestAssignment.findOneAndDelete({ testId, userId });

        return NextResponse.json({ success: true });
    } catch (error) {
        // Ignore if not found
        return NextResponse.json({ success: true });
    }
}
