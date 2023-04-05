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
    axios.get('http://localhost:3001/mythic.db/pages')
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
    axios.get('http://localhost:3001/mythic.db/pages/' + pageId)
      .then((response) => {
        setCurrentPage(response.data.id); // Moved this line down so that response is defined
        setEditorData(JSON.parse(response.data.content));
      })
      .catch((error) => {
        console.error("Error fetching page:", error);
      });
  };  

  const handleAddNewPage = () => {
    axios.post('http://localhost:3001/mythic.db/pages/', { title: 'New page', content: editorData })
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
    // Update the existing page with the current content
    axios.put('http://localhost:3001/mythic.db/pages/' + currentPage, { title: 'Updated page', content: editorData })
      .then((response) => {
        console.log('Page updated:', response.data);
        fetchPagesList(); // Refresh the pages list after updating
      })
      .catch((error) => {
        console.error('Error updating page:', error);
      });
  };  
  

  const handleDeleteNote = (pageId) => {
    axios.delete('http://localhost:3001/mythic.db/pages/' + pageId)
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
