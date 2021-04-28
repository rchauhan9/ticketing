import { app } from './app';
import mongoose from 'mongoose';
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined as an env var');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined as an env var');
    }

    try {
        await natsWrapper.connect('ticketing', 'kdjsfl', 'http://ticketing-nats-srv:4222');
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        })
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err)
    }

    app.listen(3000, () => {
        console.log("Listening on port 3000");
    });
}

start();

