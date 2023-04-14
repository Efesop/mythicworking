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
import { debounce } from '../../utils/debounce';

const customUndoRedoConfig = {
  shortcuts: {
    undo: 'CMD+Z',
    redo: 'CMD+ALT+Z'
  }
};

const EDITOR_HOLDER_ID = 'EditorJS';

const Editor = (props) => {
  const ejInstance = useRef();
  const {editorData, onEditorDataChange, onSave} = props;

  useEffect(() => {
    if (!ejInstance.current) {
      const cleanup = initEditor();
      return () => {
        cleanup();
      };
    }
    return () => {
      if (ejInstance.current) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, []);
  
 /* useEffect(() => {
    if (ejInstance.current) {
      ejInstance.current.destroy();
    }
    const cleanup = initEditor();
    return () => {
      cleanup();
    };
  }, [editorData]);  */

  const initEditor = () => {
  const editor = new EditorJS({
    holder: EDITOR_HOLDER_ID,
    logLevel: "ERROR",
    data: editorData,
    onReady: () => {
      ejInstance.current = editor;
      handleReady(editor);
    },
    onChange: debounce(async () => {
      let content = await ejInstance.current.saver.save();
      onEditorDataChange(content);
      onSave(ejInstance.current); // Pass the editor instance to onSave
    }, 300),                  
    autofocus: true,
    tools: {
      header: Header,
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
            byFile: '/uploadFile', // Your backend file uploader endpoint
            byUrl: '/fetchUrl', // Your endpoint that provides uploading by Url
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

  return () => {
    if (ejInstance.current) {
      ejInstance.current.destroy();
      ejInstance.current = null;
    }
  };
};

  const handleReady = (editor) => {
    new Undo({ editor, config: customUndoRedoConfig });
    new DragDrop(editor);
  
    const handleKeyDown = async (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        onSave(editor);
      }
    };
  
    editor.isReady
      .then(() => {
        window.addEventListener('keydown', handleKeyDown);
      })
      .catch((error) => {
        console.error('Error during Editor.js initialization: ', error);
      });
  
    // Cleanup event listener when the component is unmounted or reinitialized
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  };  

  return (
    <React.Fragment>
      <div id={EDITOR_HOLDER_ID}> </div>
    </React.Fragment>
  );
}

export default Editor;

