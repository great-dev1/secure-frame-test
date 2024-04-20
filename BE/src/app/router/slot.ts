import { SlotController } from "app/controllers/slotController";
import { Router } from "express";

const route = Router();
const slot = new SlotController();

route.get("/", slot.index)
route.post("/:id", slot.book)

export default route