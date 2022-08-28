import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./app/database/db.js";
import Api from './app/routes/api.js'
dotenv.config({ path: 'config.env' })

const port = process.env.PORT || 5000
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

connectDB()

app.get('/', (req, res) => {
    res.json({
        status: true,
        message: "Welcome to mongo-node.",
        data: null
    })
})

//user routes
app.use('/api', Api)


app.listen(port, () => {
    console.log(`Express app running on port ${port}`)
})