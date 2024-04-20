import { NextFunction, Request, Response } from "express";
import fs from 'fs';
import csv from 'csv-parser';
import Coach, { ICoach } from "app/models/coachModel";
import Day, { IDay } from "app/models/dayModel";
import Slot from "app/models/slot";
import { parseTimeString } from "app/utils/parseTimeString";

export class AddDataController {
    /**
     * Reads data from a CSV file, processes it, and adds it to the database.
     * 
     * @param req Express Request object.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     * @returns Promise<void>
     */
    async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await readCSV('src/data.csv');

            for (const row of data) {
                try {
                    let coach: ICoach = await findOrCreateCoach(row.Name, row.Timezone);

                    const day: IDay = await createDay(coach._id, row['Day of Week'], row['Available at'], row['Available until']);

                    await createSlots(day._id, row['Available at'], row['Available until']);

                } catch (error) {
                    console.error(error);
                }
            }

            console.log('CSV file successfully processed');
            res.status(200).json({ message: 'CSV file successfully processed' });

        } catch (error) {
            next(error);
        }
    }
}

/**
 * Reads data from a CSV file.
 * 
 * @param filePath Path to the CSV file.
 * @returns Promise<any[]> A promise that resolves with an array of objects representing rows of data from the CSV.
 */
async function readCSV(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const data: any[] = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                resolve(data);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

/**
 * Finds or creates a coach in the database.
 * 
 * @param name Name of the coach.
 * @param timezone Timezone of the coach.
 * @returns Promise<ICoach> A promise that resolves with the coach object.
 */
async function findOrCreateCoach(name: string, timezone: string): Promise<ICoach> {
    let coach: ICoach = await Coach.findOne({ name });
    if (!coach) {
        coach = await Coach.create({ name, timezone });
    }
    return coach;
}

/**
 * Creates a day associated with a coach.
 * 
 * @param coachId ID of the coach associated with the day.
 * @param dayOfWeek Day of the week.
 * @param availableAt Time when coach is available.
 * @param availableUntil Time until coach is available.
 * @returns Promise<IDay> A promise that resolves with the created day object.
 */
async function createDay(coachId: string, dayOfWeek: string, availableAt: string, availableUntil: string): Promise<IDay> {
    // Create the day
    const day = await Day.create({
        day: dayOfWeek,
        availableAt: availableAt.trim(),
        availableUntil: availableUntil.trim(),
        coach: coachId,
    });

    // Push the day's _id into the coach's days array
    await Coach.findByIdAndUpdate(coachId, { $push: { days: day._id } });

    return day;
}


/**
 * Creates slots for a day.
 * 
 * @param dayId ID of the day associated with the slots.
 * @param availableAtStr Start time of availability.
 * @param availableUntilStr End time of availability.
 * @returns Promise<void>
 */
async function createSlots(dayId: string, availableAtStr: string, availableUntilStr: string): Promise<void> {
    const availableAt = parseTimeString(availableAtStr);
    const availableUntil = parseTimeString(availableUntilStr);
    const slotDuration = 30 * 60 * 1000;
    let time = availableAt;

    while (time < availableUntil) {
        const slotEndTime = new Date(time.getTime() + slotDuration);
        const slotEndTimeString = slotEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        await Slot.create({
            availableAt: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            availableUntil: slotEndTimeString,
            day: dayId,
        });
        time = slotEndTime;
    }
}
