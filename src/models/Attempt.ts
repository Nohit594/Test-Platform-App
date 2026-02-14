import mongoose from 'mongoose';

const AttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    answers: {
        type: String, // Stored as JSON string
        required: true,
    },
}, { timestamps: true });

// Enforce one attempt per test per user (matches schema.prisma @@unique)
AttemptSchema.index({ userId: 1, testId: 1 }, { unique: true });

export default mongoose.models.Attempt || mongoose.model('Attempt', AttemptSchema);
