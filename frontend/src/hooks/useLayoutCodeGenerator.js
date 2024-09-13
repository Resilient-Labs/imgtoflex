import { useState } from "react";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const useLayOutCodeGenerator = () => {
  const [layoutCode, setLayoutCode] = useState("");

  const handleGetCode = async () => {
    try {
      const response = await fetch(`${backendURL}/generateLayoutCode`, {
        method: "POST",
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
    }
  };
  return { handleGetCode, layoutCode };
};

export default useLayOutCodeGenerator;
