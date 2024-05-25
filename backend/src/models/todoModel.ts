import mongoose, { Schema } from 'mongoose';
import { Todo } from '../interfaces';


const TodoSchema: Schema = new Schema({
    title: { type: String, required: true },
});

export default mongoose.model<Todo>('todos', TodoSchema);
