/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from 'editorjs-header-with-alignment';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
/* import ToggleBlock from 'editorjs-toggle-block'; */
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import ImageTool from '@editorjs/image';
import CodeTool from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
import Underline from '@editorjs/underline';
import Hyperlink from 'editorjs-hyperlink';
import axios from 'axios';

const customUndoRedoConfig = {
  shortcuts: {
    undo: 'CMD+Z',
    redo: 'CMD+ALT+Z'
  }
};

const DEFAULT_INITIAL_DATA = () => {
  return {
    "time": new Date().getTime(),
    "blocks": [
      {
        "type": "header",
        "data": {
          "text": "This is my awesome editor!",
          "level": 1
        }
      },
    ]
  }
}

const Editor = ({ editorData, onEditorDataChange }) => {
  const ejInstance = useRef();
  const editorRef = useRef(null);

  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      if (ejInstance.current) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!ejInstance.current && editorRef.current) {
      initEditor();
    }
  }, [editorRef.current]);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: editorRef.current,
      logLevel: "ERROR",
      data: editorData,
      onReady: () => {
        ejInstance.current = editor;
        handleReady(editor);
      },
      onChange: async () => {
        let content = await editor.saver.save();
        onEditorDataChange({ content, editor });
      },
      autofocus: true,
      tools: {
        header: Header,
        /* toggle: {
          class: ToggleBlock,
          inlineToolbar: true,
        }, */
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
              byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
            }
          }
        },
        code: CodeTool,
        inlineCode: {
          class: InlineCode,
          shortcut: 'CMD+SHIFT+M',
        },
        underline: Underline,
        hyperlink: {
          class: Hyperlink,
          config: {
            shortcut: 'CMD+L',
            target: '_blank',
            rel: 'nofollow',
            availableTargets: ['_blank', '_self'],
            availableRels: ['author', 'noreferrer'],
            validate: false,
          }
        },
      },
    });
  };

  const updateEditorContent = async (newData) => {
    if (!ejInstance.current) {
      return;
    }

    await ejInstance.current.clear();
    await ejInstance.current.render(newData);
  };
    

  const handleReady = (editor) => {
    new Undo({ editor, config: customUndoRedoConfig });
    new DragDrop(editor);
  };

  

return (
  <React.Fragment>
    <div ref={editorRef}> </div>
  </React.Fragment>
);
}

const App = () => {
  const [editorData, setEditorData] = React.useState({ content: DEFAULT_INITIAL_DATA, editor: null });

const saveEditorData = async () => {
  if (!editorData.editor) {
    return;
  }
  
  const outputData = await editorData.editor.saver.save();
  console.log("Article data: ", outputData);

    // Send the data to your backend
    axios
    .post("/save-editor-data", outputData)
    .then((response) => {
      console.log("Data saved successfully: ", response);
    })
    .catch((error) => {
      console.log("Error saving data: ", error);
    });
};

  return (
    <>
     <Editor editorData={editorData.content} onEditorDataChange={setEditorData} />
      <button onClick={saveEditorData}>Save</button>
    </>
  );
};

export default App;