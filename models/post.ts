import { Schema, model, Document } from 'mongoose';

const postSchema = new Schema({
    created: {
        type: Date
    },
    message: {
        type: String,
    },
    img: [{
        type: String
    }],
    coords: {
        type: String // lat y lon
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Is required']
    }
});

postSchema.pre<IPost>('save', function(next) {
    this.created = new Date();
    next();
});

interface IPost extends Document {
    created: Date;
    message: String;
    img: String[];
    coords: String,
    user: String;

}

export const Post = model<IPost>('Post', postSchema);
