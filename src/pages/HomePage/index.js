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
        text: 'This is the editor!',
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
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('createdAt', { ascending: true }); // Change this line to order pages
      if (error) throw error;
      setPagesList(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  }, []);  

  useEffect(() => {
    fetchPagesList().then(() => {
      if (pagesList && pagesList.length > 0) {
        handlePageClick(pagesList[0].id);
      }
    });
  }, [fetchPagesList, pagesList]);  

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
      if (data && data.length > 0) {
        setCurrentPage(data[0].id);
      }
      setEditorData({ ...DEFAULT_INITIAL_DATA }); // Use the spread operator here
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };    

  const onSave = async (editorInstance) => {
    try {
      const content = await editorInstance.saver.save();
      if (currentPage) {
        const { data, error } = await supabase
          .from('pages')
          .update({ title: 'Updated page', content: JSON.stringify(content) })
          .eq('id', currentPage);
        if (error) throw error;
        console.log('Page updated:', data);
        console.log('Saved content:', content); // Log the saved content
        fetchPagesList();
      } else {
        const { data, error } = await supabase.from('pages').insert([{ title: 'New page', content: JSON.stringify(content) }]);
        if (error) throw error;
        console.log('Page created:', data);
        fetchPagesList();
        if (data && data.length > 0) {
          setCurrentPage(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };       

  const handleDeleteNote = async (pageId) => {
    try {
      const { data, error } = await supabase.from('pages').delete().eq('id', pageId);
      if (error) throw error;
      console.log('Page deleted');
      // Update the pagesList state after a page is deleted
      setPagesList((prevPagesList) => prevPagesList.filter((page) => page.id !== pageId));
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const handleRenameNote = async (pageId, newTitle) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .update({ title: newTitle })
        .eq('id', pageId);
      if (error) throw error;
      console.log('Page renamed:', data);
      fetchPagesList();
    } catch (error) {
      console.error('Error renaming page:', error);
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
        onRenameNote={handleRenameNote}
      />
<MainContent>
  {currentPage ? (
    <EditorJsComponent
      editorData={editorData}
      onEditorDataChange={handleEditorDataChange}
      onSave={onSave}
      currentPage={currentPage}
    />
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <h3>Select a page or create a new one to get started</h3>
    </div>
  )}
</MainContent>
      <FloatingActionButton />
    </div>
  );
}

export default HomePage;

