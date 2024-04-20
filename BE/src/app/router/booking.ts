import { BookingController } from "app/controllers/bookingController";
import { Router } from "express";

const route = Router();
const booking = new BookingController();

route.get("/", booking.index)

export default route