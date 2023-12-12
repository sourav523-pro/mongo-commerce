import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./app/config/db.js";
import Api from './app/routes/api.js';
import morgan from "morgan";

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
app.use("/uploads", express.static(__dirname, "public/uploads"));

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