import bodyParser from "body-parser";
import cors from "cors";
import { Application, NextFunction, Request, Response } from "express";
import apiRoutes from "#router"
import config from "#config";
import { ErrorHandler, handleError } from "#helpers/ErrorHandler";

export default (app: Application): void => {
    // Health Check endpoints
    app.use(
        cors({
            origin: [config.appUrl, "http://localhost:5173"],
        }),
    );

    // Middleware that transforms the raw string of req.body into json
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // Load API routes
    app.use(`/${config.endpointPrefix}`, apiRoutes);

    app.use("/", (req, res) => {
        res.send("success")
    })
    app.use(
        (err: ErrorHandler, _req: Request, res: Response, _next: NextFunction) => {
            handleError(err, res);
        },
    );
};
