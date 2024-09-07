import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import Prompt from './models/promptSchema.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'imageUploads/' });
mongoose.connect(MONGO_URI).then(() => console.log("Connected to DB")).catch(error => console.log(error));

app.post('/upload',upload.single('file') ,async (req,res) => {
    const { file } = req; //Image file for S3 integration
    const { imageName, imageType, imageSize } = req.body; //other data

    /* TODO: 
    1. Remove logs once image data and prompt are stored properly
    2. Remove local storage of images in imageUploads
    */
    console.log('File:', file);
    console.log('Image Name:', imageName);
    console.log('Image Type:', imageType);
    console.log('Image Size:', imageSize);

    const prompt = new Prompt({imgName: imageName});
    await prompt.save();

    res.status(200).json({message: "Image received", name: imageName})
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})