import { NextFunction, Request, Response } from "express";
import Day from "app/models/dayModel";
import { NotFoundException } from "#helpers/ErrorHandler";

export class DayController {
    /**
     * Retrieve all days associated with a particular coach.
     * 
     * @param req Express Request object containing the coach_id parameter.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     * @returns Promise<void>
     */
    async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { coach_id } = req.query;

            const days = await Day.find({ coach: coach_id });
            if (!days) {
                const err = new NotFoundException("Days")
                return next(err);
            }
            res.status(200).json({ days });
        } catch (error) {
            next(error);
        }
    }
}
