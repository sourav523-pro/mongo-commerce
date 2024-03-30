import mongoose from "mongoose"
import { env } from 'process'

const connectDB = async () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(env.MONGO_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            return resolve(true)
        }).catch((err) => {
            return reject(err)
        })
    })
}

export default connectDB