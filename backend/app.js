import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(bodyParser.json());

mongoose.connect(MONGO_URI).then(() => console.log("Connected to DB")).catch(error => console.log(error));

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})