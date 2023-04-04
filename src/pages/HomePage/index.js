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
    axios.get('/pages')
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
    axios.get('/pages/' + pageId)
      .then((response) => {
        setCurrentPage(response.data.id); // Moved this line down so that response is defined
        setEditorData(response.data.content);
      })
      .catch((error) => {
        console.error("Error fetching page:", error);
      });
  };  

  const handleAddNewPage = () => {
    axios.post('/pages', { title: 'New page', content: editorData })
      .then((response) => {
        console.log('Page created:', response.data);
        fetchPagesList(); // Refresh the pages list after creating a new page
        setCurrentPage(response.data.id); // Set the current page to the new page
      })
      .catch((error) => {
        console.error('Error creating page:', error);
      });
  };  

  const onSave = () => {
    if (currentPage === 'home') {
      // Create a new page with the current content
      axios.post('/pages', { title: 'New page', content: editorData })
        .then((response) => {
          console.log('Page created:', response.data);
          setPagesList([...pagesList, response.data]); // Add the new page to the pagesList state
        })
        .catch((error) => {
          console.error('Error creating page:', error);
        });
    } else {
      // Update the existing page with the current content
      axios.put('/pages/' + currentPage, { title: 'Updated page', content: editorData })
        .then((response) => {
          console.log('Page updated:', response.data);
          fetchPagesList(); // Refresh the pages list after updating
        })
        .catch((error) => {
          console.error('Error updating page:', error);
        });
    }
  };
  

  const handleDeleteNote = (pageId) => {
    axios.delete('/pages/' + pageId)
      .then(() => {
      console.log('Page deleted');
      })
      .catch((error) => {
      console.error('Error deleting page:', error);
      });
      };
      
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
        currentPage={currentPage}
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
