import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['ADMIN', 'STUDENT'],
        default: 'STUDENT',
    },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
