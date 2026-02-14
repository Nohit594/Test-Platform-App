import mongoose from 'mongoose';

const TestAssignmentSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedAt: {
        type: Date,
        default: Date.now,
    },
});

// Enforce unique assignment per user-test pair
TestAssignmentSchema.index({ testId: 1, userId: 1 }, { unique: true });

export default mongoose.models.TestAssignment || mongoose.model('TestAssignment', TestAssignmentSchema);
