import dotenv from 'dotenv'

dotenv.config()

const APP_PORT = process.env.APP_PORT || '8081'
const APP_HOST = process.env.APP_HOST || 'localhost'
const VK_SERVICE_TOKEN = process.env.VK_SERVICE_TOKEN
const VK_API_VERSION = process.env.VK_API_VERSION || 5.131

const config = {
    APP_HOST,
    APP_PORT,
    VK_SERVICE_TOKEN,
    VK_API_VERSION
}

export default config