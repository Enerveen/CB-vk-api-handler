import {Request, Response} from 'express';
import {getTimestampOfNDaysBefore, handleRecentPostsRequest} from "../utils/utils";
import log from "../utils/logging";


const getWallPosts = async (req: Request, res: Response) => {

    let {domains, timestamp, limit} = req.query

    if (!domains) {
        log.info('Domains list not provided')
        return res.status(400).json({
            error: 'No domains provided'
        })
    }

    if (!timestamp) {
        timestamp = getTimestampOfNDaysBefore(1)
        log.info(`Edge timestamp not provided, set by default to 1 day ago: ${timestamp}`)
    }

    if (!limit) {
        limit = '5'
        log.info(`Posts limit per source not provided, set by default to ${limit}`)
    }

    const resultData = await handleRecentPostsRequest(domains as string, timestamp as string, limit as string)

    return res.status(200).json(resultData)
}

export default {getWallPosts}