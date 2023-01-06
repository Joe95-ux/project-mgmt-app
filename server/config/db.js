const mongoose = require("mongoose");

const connectDB = async ()=> {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)

    }catch(e){
        console.error(e);
    }
}
mongoose.set('strictQuery', false);

module.exports = connectDB;