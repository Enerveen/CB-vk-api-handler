import http from 'http'
import express from 'express'
import config from "./config";
import cors from 'cors'
import postsRoutes from './routes/posts'
import {requestLogging} from "./utils/logging";

const app = express()

app.use(cors())
app.use(requestLogging)

app.use('/posts', postsRoutes)

const server = http.createServer(app)

server.listen(config.APP_PORT, () =>
    console.log(`Server is running on ${config.APP_HOST}:${config.APP_PORT}`))
