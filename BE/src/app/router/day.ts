import { DayController } from "app/controllers/dayController";
import { Router } from "express";

const route = Router();
const day = new DayController();

route.get("/", day.index)

export default route