import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';

const Sidebar = ({ drawerOpen, toggleDrawer, onPageClick }) => {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('/api/pages');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };
  

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNoteSelection = async (noteId) => {
    // Your logic to handle note selection
  };

  const pages = [
    { key: 'home', displayName: 'Home' },
    { key: 'page1', displayName: 'Page 1' },
    { key: 'page2', displayName: 'Page 2' },
  ];

  const handlePageClick = (pageKey) => {
    onPageClick(pageKey);
    toggleDrawer();
  };

  return (
    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
      <List>
        {pages.map(({ key, displayName }) => (
          <ListItem button key={key} onClick={() => handlePageClick(key)}>
            <ListItemText primary={displayName} />
          </ListItem>
        ))}
      </List>
      <List>
        {notes.map((note) => (
          <ListItem button key={note._id} onClick={() => handleNoteSelection(note._id)}>
            <ListItemText primary={note.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
