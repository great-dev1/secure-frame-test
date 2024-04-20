import { NextFunction, Request, Response } from "express";
import { AlreadyBookedException, NotFoundException } from "#helpers/ErrorHandler";
import Slot from "app/models/slot";
import Coach from "app/models/coachModel";
import Day from "app/models/dayModel";
import Booking from "app/models/booking";
import { bookingValidator } from "app/validators/booking";

export class SlotController {
    /**
     * Retrieve all slots associated with a particular day.
     * 
     * @param req Express Request object containing the day_id parameter.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     * @returns Promise<void>
     */
    async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { day_id } = req.query;

            const slots = await Slot.find({ day: day_id });
            if (!slots) {
                const err = new NotFoundException("Slots")
                return next(err);
            }
            res.status(200).json(slots);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Book a slot for a user.
     * 
     * @param req Express Request object containing the booking details.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     * @returns Promise<void>
     */
    async book(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = await bookingValidator.validate(req.body);
            const { id } = req.params;

            const slot = await Slot.findById(id);

            if (!slot) {
                const err = new NotFoundException("Slot")
                return next(err);
            }
            if(slot.booked){
                const err = new AlreadyBookedException();
                return next(err);
            }

            const updatedSlot = await Slot.findByIdAndUpdate(id, { booked: true }, { new: true });

            const day = await Day.findById(updatedSlot.day)
            const coach = await Coach.findById(day.coach)

            const booking = await Booking.create({ email, coach: coach._id, day: day._id, slot: updatedSlot._id })

            res.status(200).json({ message: "Booked Successfully", data: booking });
        } catch (error) {
            next(error);
        }
    }
}
