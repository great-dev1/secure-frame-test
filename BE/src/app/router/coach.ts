import { CoachController } from "app/controllers/coachController";
import { Router } from "express";

const route = Router();
const coach = new CoachController();

route.get("/", coach.index)

export default route