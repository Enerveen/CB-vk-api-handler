export interface VkApiData {
    response: VkResponse
}

export interface VkResponse {
    items: Item[]
}

export interface Item {
    text: string,
    date: string,
    owner_id: string,
    id: string
    attachments: Attachment[]
}

export interface Attachment {
    type: string,
    photo?: Photo,
    video?: Video
}

export interface Photo {
    sizes: Size[]
}

export interface Video {
    owner_id: string,
    id: string
}

export interface Size {
    url: string
}