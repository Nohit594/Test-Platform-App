import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Test from '@/models/Test';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const { id } = params;

        const test = await Test.findById(id).lean();

        if (!test) {
            return NextResponse.json({ error: 'Test not found' }, { status: 404 });
        }

        // Manually sort questions if needed, though they are stored in array order usually.
        // We need to exclude correctAnswer for security if student? 
        // The original code excluded validAnswer? No, it excluded 'correctAnswer'.
        // Mongoose select: name -password

        // However, we are returning the whole object. Let's sanitize.
        const sanitizedTest = {
            ...test,
            id: test._id.toString(),
            questions: test.questions.map((q: any) => ({
                id: q._id.toString(),
                number: q.number,
                text: q.text,
                options: q.options,
                // Exclude correctAnswer!
            })).sort((a: any, b: any) => a.number - b.number)
        };

        return NextResponse.json(sanitizedTest);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch test' }, { status: 500 });
    }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const { id } = params;
        const body = await req.json();

        // Allow updating title, isActive, showResults
        const updated = await Test.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json(updated);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update test' }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const { id } = params;

        await Test.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 });
    }
}
