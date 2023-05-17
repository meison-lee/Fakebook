import mongoose from 'mongoose';
import dotenv from "dotenv-defaults";

const connectMongoDB = () => {
    dotenv.config();
    if(!process.env.MONGO_URL){
        console.error("Missing MONGO_URL!!!");
        process.exit(1);
    };
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log('mongo connected!');
    });
}

export default connectMongoDB;