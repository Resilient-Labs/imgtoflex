import { useState } from "react";
import ImageForm from "./components/ImageForm";
import CodeSandbox from "./components/CodeSandbox";
import useImageUploader from "./hooks/useImageUploader";
// import useLayOutCodeGenerator from "./hooks/useLayoutCodeGenerator";
import "./App.css";
import { ImageUtils } from "./utils/imageUtils";

const imageUtils = new ImageUtils();
// const backendURL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const { handleSubmit, isImageUploading } = useImageUploader();
  // const { handleGetCode, isLayoutCodeGenerating, layoutCode } = useLayoutCodeGenerator();
  const [getCodeIsVisibile, setGetCodeIsVisible] = useState(false);
  const [imageFormat, setImageFormat] = useState("");
  const [layoutResponse, setLayoutResponse] = useState("");

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();

    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    try {
      setImageFormat(await imageUtils.validateImage(selectedImage));
    } catch (error) {
      console.log("Image validation error:", error.message);
      alert(error.message);
      return;
    }

    handleSubmit(selectedImage);

    const formData = new FormData();
    formData.append("file", selectedImage);

    setGetCodeIsVisible(true);

    //   try {
    //     const response = await fetch(`http://localhost:3000/upload`, {
    //       method: "POST",
    //       body: formData,
    //     });

    //     if (response.ok) {
    //       const responseData = await response.json();
    //       console.log("Response from server: ", responseData);
    //       setGetCodeIsVisible(true);
    //       alert("Image uploaded successfully!");
    //     } else {
    //       alert("Image upload failed.");
    //     }
    //   } catch (error) {
    //     console.error("Error uploading image:", error);
    //     alert("Error uploading image.");
    //   }
  };

  // useing the LayoutCodeGenerate
  // await handleGetCode();
  // setLayoutResponse(layoutCode);

  const handleGetCode = async () => {
    // const processedImage = await imageService.preProcessImage(selectedImage);

    // Call the backend route to get code.
    console.log("imageFormat:", imageFormat);
    // var body = JSON.stringify({ imageFormat: imageFormat });
    // console.log("jsonbody", body);
    const imageFormData = new FormData();
    // imageFormData.append("name", "imageFile");
    imageFormData.append("file", selectedImage);
    imageFormData.append("imageFormat", imageFormat);

    // imageFormData.append("imageData", processedImage);
    try {
      const response = await fetch(`http://localhost:3000/generateLayoutCode`, {
        method: "POST",
        // headers: {
        //   "content-type": "application/x-www-form-urlencoded",
        // },
        // body: imageFormData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response from server: ", responseData);
        const code = responseData["layoutCode"];
        console.log("layout code", code);
        setLayoutResponse(code);
        alert("Layout code successfully generated");
      } else {
        const responseData = await response.json();
        console.log("error response data", responseData);
        alert("Layout code failed to be generated.");
      }
    } catch (error) {
      console.error("Error generating layout code:", error.message);
      alert("Error generating layout code.");
    }
  };

  return (
    <>
      <h1>Image to Code</h1>
      <span>
        Upload your image below. Click the *Get Code* button that will appear
        after the image is successfully uploaded.
      </span>
      {isImageUploading ? (
        <p>Image is being converted</p>
      ) : (
        <p>Please upload a Layout image</p>
      )}
      <ImageForm
        handleSubmit={onFormSubmit}
        onImageChange={handleImageChange}
      />
      <button
        style={{
          display: getCodeIsVisibile ? "inline" : "none",
        }}
        onClick={handleGetCode}
      >
        Get Code
      </button>
      <div>{layoutResponse}</div>
      <CodeSandbox />
    </>
  );
}

export default App;
