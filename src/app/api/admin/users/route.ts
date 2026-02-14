import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();

        const students = await User.find({ role: 'STUDENT' })
            .select('name username')
            .sort({ name: 1 })
            .lean();

        // Map _id to id for frontend compatibility
        const formattedStudents = students.map((s: any) => ({
            id: s._id.toString(),
            name: s.name,
            username: s.username
        }));

        return NextResponse.json(formattedStudents);
    } catch (error) {
        console.error('Failed to fetch students:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
