import log from "yuve-shared/build/logger/logger";
import {NextFunction, Request, Response} from "express";


export const requestLogging = (req: Request, res: Response, next: NextFunction) => {
    log.request(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        log.request(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    })

    next();
}

export default log