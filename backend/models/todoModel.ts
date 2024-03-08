import mongoose, { Schema, Document } from 'mongoose';

export interface Todo extends Document {
    title: string;
}

const TodoSchema: Schema = new Schema({
    title: { type: String, required: true },
});

export default mongoose.model<Todo>('todos', TodoSchema);
