import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    // FormData to handle file upload
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Image uploaded successfully!");
      } else {
        alert("Image upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image.");
    }
  };
  return (
    <>
      <h1>Image to Code</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Upload Image</button>
      </form>
    </>
  )
}


export default App
