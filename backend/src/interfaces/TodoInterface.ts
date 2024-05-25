import Document from 'mongoose';

export default interface Todo extends Document  {
    title: string;
}