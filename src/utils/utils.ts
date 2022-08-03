import axios from "axios";
import {Item, VkResponseItem} from "../types";
import config from "../config";
import log from "./logging";
import runWithErrorHandler from "yuve-shared/build/runWithErrorHandler/runWithErrorHandler";
import getVkScriptCode from "../vkScript";

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

export const reformatResponseItem = (responseItem: VkResponseItem, edgeTimestamp: string, index: number, domainsList: string[]) => {

    const {items}: { items: Item[] } = responseItem || {}
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

export const handleRecentPostsRequest = async (domains: string, timestamp: string, count: string) => {

    const {data: {response}} = await runWithErrorHandler(() => api.get('api.vk.com/method/execute', {
        access_token: config.VK_SERVICE_TOKEN,
        v: config.VK_API_VERSION,
        code: getVkScriptCode(domains, count)
    })) || { data: {response: []} }
    log.request(`Request sent to VK API. Domains are ${domains}, response: `, response)
    const recentPosts = (response || []).map((item: VkResponseItem, index: number) =>
        reformatResponseItem(item, timestamp, index, domains.split(','))).flat()

    if (!recentPosts.length) {
        log.info('No recent posts for the last request')
    }
    return recentPosts
}