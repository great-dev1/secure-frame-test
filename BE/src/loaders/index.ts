import { Application } from 'express';
import databaseLoader from "./database";
import expressLoader from "./express";
export default async (app: Application): Promise<void> => {
    try {
        await databaseLoader();
    } catch (err) {
        console.log(err);
        throw err;
    }
    console.log('Database loaded and connected!');

    expressLoader(app);
    console.log('Express loaded!');
};