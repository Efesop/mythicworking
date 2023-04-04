import React, { useState, useEffect, useCallback } from 'react';
import AppBar from '../../components/AppBar';
import MainContent from '../../components/MainContent';
import FloatingActionButton from '../../components/FloatingActionButton';
import EditorJsComponent from '../../components/EditorJsComponent/EditorJsComponent';
import Sidebar from '../../components/Sidebar';
import Button from '@mui/material/Button';
import axios from 'axios';

const DEFAULT_INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: 'header',
      data: {
        text: 'This is my awesome editor!',
        level: 1,
      },
    },
  ],
};

function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editorData, setEditorData] = useState(DEFAULT_INITIAL_DATA);
  const [currentPage, setCurrentPage] = useState('home');
  const [pagesList, setPagesList] = useState([]);

  const fetchPagesList = useCallback(() => {
    axios
      .get('/database/pages')
      .then((response) => {
        setPagesList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching pages:', error);
      });
  }, []);

  useEffect(() => {
    fetchPagesList();
  }, [fetchPagesList]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleEditorDataChange = (newData) => {
    setEditorData(newData);
  };
  
  const handlePageClick = (pageId) => {
    setCurrentPage(pageId);
    axios
      .get('/database/pages/' + pageId)
      .then((response) => {
        setEditorData(response.data.content);
      })
      .catch((error) => {
        console.error("Error fetching page:", error);
      });
  };

  const handleAddNewPage = () => {
    // Set the editor data to the default initial data
    setEditorData(DEFAULT_INITIAL_DATA);
    // Reset the current page state to 'home'
    setCurrentPage('home');
  };
  
  
  const onSave = () => {
    if (currentPage === 'home') {
      // Create a new page with the current content
      axios.post('/database/pages', {
        title: 'New page',
        content: editorData,
      })
      .then((response) => {
        console.log('Page created:', response.data);
        setPagesList([...pagesList, response.data]); // Add the new page to the pagesList state
      })
      .catch((error) => {
        console.error('Error creating page:', error);
      });
    } else {
      // Update the existing page with the current content
      axios.put('/database/pages/' + currentPage, {
        title: 'Updated page',
        content: editorData,
      })
      .then((response) => {
        console.log('Page updated:', response.data);
      })
      .catch((error) => {
        console.error('Error updating page:', error);
      });
    }
  };

  const handleDeleteNote = (pageId) => {
    axios
      .delete('/database/pages/' + pageId)
      .then(() => {
      console.log('Page deleted');
      })
      .catch((error) => {
      console.error('Error deleting page:', error);
      });
      };
      
      useEffect(() => {
      fetchPagesList();
      }, [fetchPagesList]);
      
      return (
      <div>
      <AppBar toggleDrawer={toggleDrawer} />
      <Sidebar
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
        onPageClick={handlePageClick}
        onDeleteNote={handleDeleteNote}
        notes={pagesList}
        onAddNewPage={handleAddNewPage}
      />
      <MainContent>
      <EditorJsComponent editorData={editorData} onEditorDataChange={handleEditorDataChange} onSave={onSave} />
      </MainContent>
      <Button onClick={onSave}>Save</Button>
      <FloatingActionButton />
      </div>
      );
      }
      
      export default HomePage;
