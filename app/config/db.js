import mongoose from "mongoose"
import { env } from 'process'

const connectDB = async () => {
    mongoose.connect(env.MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        return Promise.resolve(true)
    }).catch((err) => {
        return Promise.reject(err)
    })
    // mongoose.set('strictQuery', false)
}

export default connectDB