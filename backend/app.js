import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import Prompt from './models/promptSchema.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI).then(() => console.log("Connected to DB")).catch(error => console.log(error));

app.post('/upload', async (req,res) => {
    const newImage = req.body;
    console.log("here is our image: ", newImage);

    const prompt = new Prompt({imgName: newImage.name});
    await prompt.save();

    res.status(200).json({message: "Image name received", image: newImage})
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})