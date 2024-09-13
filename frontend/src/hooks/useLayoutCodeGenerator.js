import { useState } from "react";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const useLayOutCodeGenerator = () => {
  const [isLayoutCodeGenerating, setIsLayoutCodeGenerating] = useState(false);
  const [layoutCode, setLayoutCode] = useState("");

  const handleGetCode = async () => {
    // const processedImage = await imageService.preProcessImage(selectedImage);

    // Call the backend route to get code.
    // console.log("imageFormat:", imageFormat);
    // // var body = JSON.stringify({ imageFormat: imageFormat });
    // // console.log("jsonbody", body);
    // const imageFormData = new FormData();
    // // imageFormData.append("name", "imageFile");
    // imageFormData.append("file", selectedImage);
    // imageFormData.append("imageFormat", imageFormat);

    // imageFormData.append("imageData", processedImage);
    try {
      const response = await fetch(`${backendURL}/generateLayoutCode`, {
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
        setLayoutCode(code);
        alert("Layout code successfully generated");
      } else {
        const responseData = await response.json();
        console.log("error response data", responseData);
        alert("Layout code failed to be generated.");
      }
    } catch (error) {
      console.error("Error generating layout code:", error.message);
      alert("Error generating layout code.");
    } finally {
      setIsLayoutCodeGenerating(false);
    }
  };

  return { handleGetCode, isLayoutCodeGenerating, layoutCode };
};

export default useLayOutCodeGenerator;
