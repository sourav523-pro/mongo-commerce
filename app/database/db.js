import mongoose from "mongoose"
import { env } from 'process'

const connectDB = () => {
    mongoose.connect(env.MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log(`MongoDB connected: ${env.MONGO_DB_USER} `)
    }).catch((err) => {
        console.error(`Error: ${err.message}`)
        console.log(err)
        process.exit(1)
    })
}

export default connectDB