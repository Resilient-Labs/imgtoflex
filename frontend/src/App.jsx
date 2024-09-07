import {useState } from 'react'
import ImageForm from './components/ImageForm';
import useImageUploader from './hooks/useImageUploader';
import './App.css'

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const {handleSubmit, isImageUploading} = useImageUploader();

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    handleSubmit(selectedImage);
  };
  return (
    <>
      <h1>Image to Code</h1>
      {isImageUploading ? <p>Image is being converted</p> : <p>Please upload a Layout image</p>}
      <ImageForm handleSubmit={onFormSubmit} onImageChange={handleImageChange}/>
    </>
  )
}


export default App
