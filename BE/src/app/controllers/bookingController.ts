import { NextFunction, Request, Response } from "express";
import Booking from "app/models/booking";
import { NotFoundException } from "#helpers/ErrorHandler";

export class BookingController {
    /**
     * Retrieve all bookings for a given email.
     * 
     * @param req Express Request object containing the email_id as a query parameter.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     * @returns Promise<void>
     */
    async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email_id } = req.query;

            if (!email_id || typeof email_id !== 'string') {
                const err = new NotFoundException("Email ID");
                return next(err);
            }

            const bookings = await Booking.find({ email: email_id })
                .populate('coach')
                .populate('day')
                .populate('slot');

            if (!bookings || bookings.length === 0) {
                const err = new NotFoundException("Bookings");
                return next(err);
            }

            res.status(200).json(bookings);
        } catch (error) {
            next(error);
        }
    }
}
