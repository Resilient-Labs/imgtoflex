import React, { useEffect } from 'react';

const Results = ({ html, css }) => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, [css]);

  return (
    <div className="results-container">
      <h2>Results</h2>
      <div className="result-html">
        <h3>HTML Output</h3>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};

export default Results;