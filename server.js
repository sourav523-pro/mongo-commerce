import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import bodyParser from "body-parser"
import path from "path"
import { fileURLToPath } from "url"
import connectDB from "./app/config/db.js"
import Api from './app/routes/api.js'
import morgan from "morgan"

dotenv.config({ path: 'config.env' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(cors())
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use("/uploads", express.static(__dirname + "public/uploads"))

const PORT = process.env.PORT || 5000

/** Routes **/
app.get('/', (req, res) => {
    res.json({
        status: true,
        message: "Welcome to mongo-node.",
        data: null
    })
})


/** api routes **/
app.use('/api', Api)

app.post('/routes', (req, res) => {
    let route, routes = []

    function getRoutes(middleware) {
        if (middleware.route) { // routes registered directly on the app
            routes.push(middleware.route);
        } else if (middleware.name === 'router') { // router middleware 
            middleware.handle.stack.forEach(function (handler) {
                route = handler.route;
                route && routes.push(route);
            });
        } else {
            console.log(middleware)
        }
    }

    app._router.stack.forEach(getRoutes)
    Api.stack.forEach(getRoutes)

    res.json({
        routes
    })
})

try {
    let con = await connectDB()
    if (con) {
        console.log(`MongoDB connected: ${process.env.MONGO_DB_USER || ''} `)
        app.listen(PORT, () => {
            console.log(`Express app running on port ${PORT}`)
        })
    }
} catch (err) {
    console.error(`Error: ${err.message}`)
    console.log(err)
    process.exit(1)
}