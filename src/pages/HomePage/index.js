import React, { useState, useEffect, useCallback } from 'react';
import AppBar from '../../components/AppBar';
import MainContent from '../../components/MainContent';
import FloatingActionButton from '../../components/FloatingActionButton';
import EditorJsComponent from '../../components/EditorJsComponent/EditorJsComponent';
import Sidebar from '../../components/Sidebar';
import Button from '@mui/material/Button';
import { supabase } from '../../supabaseClient';

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
  const [currentPage, setCurrentPage] = useState(null);
  const [pagesList, setPagesList] = useState([]);

  const fetchPagesList = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('pages').select('*');
      if (error) throw error;
      setPagesList(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
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
  
  const handlePageClick = async (pageId) => {
    try {
      const { data, error } = await supabase.from('pages').select('*').eq('id', pageId).single();
      if (error) throw error;
      setCurrentPage(data.id);
      setEditorData(JSON.parse(data.content));
    } catch (error) {
      console.error("Error fetching page:", error);
    }
  };

  const handleAddNewPage = async () => {
    try {
      const { data, error } = await supabase.from('pages').insert([{ title: 'New page', content: JSON.stringify(DEFAULT_INITIAL_DATA) }]);
      if (error) throw error;
      console.log('Page created:', data);
      fetchPagesList();
      setCurrentPage(data[0].id);
      setEditorData(DEFAULT_INITIAL_DATA);
    } catch (error) {
      console.error('Error creating page:', error);
    }
  }; 

  const onSave = async () => {
    if (currentPage) {
      try {
        const { data, error } = await supabase.from('pages').update({ title: 'Updated page', content: JSON.stringify(editorData) }).eq('id', currentPage);
        if (error) throw error;
        console.log('Page updated:', data);
        fetchPagesList();
      } catch (error) {
        console.error('Error updating page:', error);
      }
    } else {
      handleAddNewPage();
    }
  };

  const handleDeleteNote = async (pageId) => {
    try {
      const { data, error } = await supabase.from('pages').delete().eq('id', pageId);
      if (error) throw error;
      console.log('Page deleted');
    } catch (error) {
      console.error('Error deleting page:', error);
    }
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

