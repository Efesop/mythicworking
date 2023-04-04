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

const EDITOR_HOLDER_ID = 'EditorJS';

const Editor = (props) => {
  const ejInstance = useRef();
  const {editorData, onEditorDataChange, onSave} = props;

  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      ejInstance.current.destroy();
      ejInstance.current = null;
    }
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: EDITOR_HOLDER_ID,
      logLevel: "ERROR",
      data: editorData,
      onReady: () => {
        ejInstance.current = editor;
        handleReady(editor);
      },
      onChange: async () => {
        let content = await ejInstance.current.saver.save();
        onEditorDataChange(content);
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
  const handleReady = (editor) => {
    new Undo({ editor, config: customUndoRedoConfig });
    new DragDrop(editor);
  
    editor.isReady
      .then(() => {
        editor.container.closest('.codex-editor__redactor').addEventListener('keydown', async (event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            onSave(editor);
          }
        });
      })
      .catch((error) => {
        console.error('Error during Editor.js initialization: ', error);
      });
  };
  

  return (
    <React.Fragment>
      <div id={EDITOR_HOLDER_ID}> </div>
    </React.Fragment>
  );
}

export default Editor;