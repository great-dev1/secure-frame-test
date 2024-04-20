import { AddDataController } from "app/controllers/addDataController";
import { Router } from "express";
import coach from "./coach";
import slot from "./slot";
import day from "./day";
import booking from "./booking";

const route = Router();
const addData = new AddDataController();

route.post("/add-data", addData.index)
route.use("/coach", coach)
route.use("/slot", slot)
route.use("/day", day)
route.use("/booking",booking)

export default route;
