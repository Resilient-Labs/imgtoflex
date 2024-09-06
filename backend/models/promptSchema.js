import mongoose from "mongoose";
const {Schema, model} =mongoose;

const promptSchema = new Schema({
    imgName: String,
})

const Prompt = mongoose.model('Prompt', promptSchema);

export default Prompt;