import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css'; // CodeMirror CSS
import 'codemirror/mode/htmlmixed/htmlmixed'; // HTML mode
import 'codemirror/mode/css/css'; // CSS mode
import 'codemirror/theme/material.css'; // Optional: a CodeMirror theme
import '../CodeSandBox.css'; // Import component-specific styles
import Results from './Results'; // Import the new Results component

const CodeSandbox = () => {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');

  return (
     <div className="editor-container">
      <div className="editor-wrapper">
        <h2 className='folder'>HTML Editor</h2>
        <CodeMirror
          value={html}
          options={{
            mode: 'htmlmixed',
            theme: 'material',
            lineNumbers: true
          }}
          onBeforeChange={(editor, data, value) => {
            setHtml(value);
          }}
        />
      </div>

      <div className="editor-wrapper">
        <h2 className='folder'>CSS Editor</h2>
        <CodeMirror
          value={css}
          options={{
            mode: 'css',
            theme: 'material',
            lineNumbers: true
          }}
          onBeforeChange={(editor, data, value) => {
            setCss(value);
          }}
        />
      </div>

  
      <Results html={html} css={css} />
    </div>
  );
};

export default CodeSandbox;