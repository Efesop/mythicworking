import React, { useState, useEffect, useCallback } from 'react';
import AppBar from '../../components/AppBar';
import MainContent from '../../components/MainContent';
import FloatingActionButton from '../../components/FloatingActionButton';
import EditorJsComponent from '../../components/EditorJsComponent/EditorJsComponent';
import Sidebar from '../../components/Sidebar';
import Button from '@mui/material/Button';

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
  
  const [pagesData, setPagesData] = useState({
    page1: { time: new Date().getTime(),
      blocks: [
        {
          type: 'header',
          data: {
            text: 'Page 1 content',
            level: 1,
          },
        },
      ],},
    page2: { time: new Date().getTime(),
      blocks: [
        {
          type: 'header',
          data: {
            text: 'Page 2 content',
            level: 1,
          },
        },
      ], },
  });

  const saveCurrentPageData = useCallback(() => {
    setPagesData((prevPagesData) => {
      return {
        ...prevPagesData,
        [currentPage]: editorData,
      };
    });
  }, [currentPage, editorData]);

  useEffect(() => {
    if (pagesData[currentPage]) {
      setEditorData(pagesData[currentPage]);
    } else if (currentPage === 'home') {
      setEditorData(DEFAULT_INITIAL_DATA);
    }
  }, [currentPage, pagesData]);
  

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleEditorDataChange = (newData) => {
    setEditorData(newData);
  };

  const handlePageClick = (pageKey) => {
    saveCurrentPageData();
    setCurrentPage(pageKey);
  }; 

  return (
    <div>
      <AppBar toggleDrawer={toggleDrawer} />
      <Sidebar
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
        onPageClick={handlePageClick}
      />
      <MainContent>
        <EditorJsComponent
          editorData={editorData}
          onEditorDataChange={handleEditorDataChange}
        />
      </MainContent>
      <Button id="save-btn" variant="contained" color="primary" onClick={saveCurrentPageData}>
        Save
      </Button>
      <FloatingActionButton />
    </div>
  );
}
export default HomePage;
