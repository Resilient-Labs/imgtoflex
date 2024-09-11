import React, { useState, useEffect, useRef } from 'react';

const CodeSandbox = () => {
  const [htmlCode, setHtmlCode] = useState(`
    <style>
      p {
        color: blue;
      }
    </style>
    <p>Hello World</p>
    <script>
      const p = document.querySelector('p');
      setInterval(() => {
        p.innerHTML += '! ';
      }, 1000)
    </script>
  `);
  const iframeRef = useRef(null);

  const handleCodeChange = (e) => {
    setHtmlCode(e.target.value);
  };


  // Update the iframe content whenever htmlCode changes
  useEffect(() => {
    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    // Write the user-provided HTML/JS/CSS into the iframe
    iframeDocument.open();
    iframeDocument.write(htmlCode);
    iframeDocument.close();
  }, [htmlCode]);

  return (
    <div>
      <textarea
        rows="10"
        cols="50"
        value={htmlCode}
        onChange={handleCodeChange}
        placeholder="Write HTML code here..."
      />
      <div>
        <h3>Output:</h3>
        <iframe title="Code Output" ref={iframeRef} style={{ width: '100%', height: '300px', border: '1px dotted gray' }} />
      </div>
    </div>
  );
};

export default CodeSandbox;