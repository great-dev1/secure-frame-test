import config from '#config';
import mongoose from 'mongoose';

export default async () => {
    try {
        await mongoose.connect(config.mongoUrl);
    } catch (err) {
        console.log(err);
        throw err;
    }
};
