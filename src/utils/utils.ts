import axios from "axios";
import {Item, VkApiData, VkResponse} from "../types";
import config from "../config";
import log from "./logging";
import runWithErrorHandler from "yuve-shared/build/runWithErrorHandler/runWithErrorHandler";

enum AttachmentTypes {
    photo = 'photo',
    video = 'video'
}

export const api = {
    async get(path: string, params?: object) {
        return await axios.get(`https://${path}`, {params})
    },
}

export const getTimestampOfNDaysBefore = (daysDiff: number): string => {
    const date = new Date()
    return (+date.setDate(date.getDate() - daysDiff)).toString().substr(0, 10)
}

export const reformatResponse = (data: VkApiData, edgeTimestamp: string) => {

    const {response}: { response: VkResponse } = data || {}
    const {items}: { items: Item[] } = response || {}
    const result = items?.filter(({date}: Item) => Number(date) > Number(edgeTimestamp))
        .map(({text, attachments, owner_id, id}: Item) => ({
            text: text,
            content: attachments?.filter(({type}) => type === AttachmentTypes.photo || type === AttachmentTypes.video)
                .map(({type, photo, video}) => {
                    if (photo) {
                        return {
                            media: photo.sizes[photo?.sizes.length - 1]?.url,
                            type
                        }
                    }
                    if (video) {
                        return {
                            media: `https://vk.com/video${video.owner_id}_${video.id}`,
                            type
                        }
                    }
                    return {
                        media: `https://vk.com/ruzkeyoutube?w=wall${owner_id}_${id}`,
                        type: 'unsupportedAttachment'
                    }
                }) || [{
                media: `https://vk.com/ruzkeyoutube?w=wall${owner_id}_${id}`,
                type: 'unsupportedAttachment'
            }]
        }))
    return result || []
}

export const handleRecentPostsRequest = async (domainsList: string[], timestamp: string, count: string) => {

    const recentPostsRequests: object[] = await domainsList.map(async (domain: string) => {
            const {data} = await runWithErrorHandler(() => api.get('api.vk.com/method/wall.get', {
                access_token: config.VK_SERVICE_TOKEN,
                v: config.VK_API_VERSION,
                domain,
                count
            })) || { data: [] }
            log.request(`Request sent to VK API. Domain is ${domain}, response: `, data)
            return reformatResponse(data, timestamp)

    })

    const recentPosts: object[] = (await Promise.all(recentPostsRequests)).flat()
    if (!recentPosts.length) {
        log.info('No recent posts for the last requests')
    }
    return recentPosts
}