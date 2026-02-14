import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    number: { type: Number, required: true },
    text: { type: String, required: true },
    options: { type: String, required: true }, // Stored as JSON string
    correctAnswer: { type: Number, required: true },
});

const TestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    correctMarks: {
        type: Number,
        default: 4,
    },
    incorrectMarks: {
        type: Number,
        default: -1,
    },
    duration: {
        type: Number, // in minutes
        default: 180,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    showResults: {
        type: Boolean,
        default: false,
    },
    questions: [QuestionSchema],
}, { timestamps: true });

export default mongoose.models.Test || mongoose.model('Test', TestSchema);
