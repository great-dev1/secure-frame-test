import { NextFunction, Request, Response } from "express";
import Coach from "app/models/coachModel";
import { NotFoundException } from "#helpers/ErrorHandler";

export class CoachController {
    /**
     * Retrieve all coaches.
     * 
     * @param req Express Request object.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     * @returns Promise<void>
     */
    async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const coaches = await Coach.find({}).populate('days');;
            if (!coaches) {
                const err = new NotFoundException("Coaches")
                return next(err);
            }
            res.status(200).json(coaches);
        } catch (error) {
            next(error);
        }
    }
}
