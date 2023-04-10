import mongoose from "mongoose";

const URL_MONGO = process.env.URL_MONGO

const conectarDB = async() => {
    try {
        await mongoose.connect(URL_MONGO, {
            useNewUrlParser: true
        })
        console.log('Conectado a DB🛫')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default conectarDB;