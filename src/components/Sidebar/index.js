// Sidebar/index.js

import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import ListItemButton from '@mui/material/ListItemButton';
import TextField from '@mui/material/TextField';

const Sidebar = ({ drawerOpen, toggleDrawer, onPageClick, onDeleteNote, notes, onAddNewPage, currentPage, onRenameNote }) => {
  const [editableNoteId, setEditableNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [activePage, setActivePage] = useState(null);

  const handleNoteTitleChange = (event) => {
    setNoteTitle(event.target.value);
  };

  const handleNoteTitleEdit = (note) => {
    setEditableNoteId(note.id);
    setNoteTitle(note.title);
  };

  const handleNoteTitleSave = (pageId) => {
    onRenameNote(pageId, noteTitle);
    setEditableNoteId(null);
  };

  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={toggleDrawer}
      variant="temporary"
    >
      <List>
        {notes.map((note) => (
          <ListItemButton
          key={`${note.id}-${note.id === activePage}`}
          selected={note.id === activePage}
          onClick={() => {
            setActivePage(note.id);
            onPageClick(note.id);
          }}
          onDoubleClick={() => handleNoteTitleEdit(note)}
        >
          {editableNoteId === note.id ? (
              <TextField
                value={noteTitle}
                onChange={handleNoteTitleChange}
                onBlur={() => handleNoteTitleSave(note.id)}
              />
            ) : (
              <ListItemText primary={note.title} />
            )}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="delete"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the click event on the parent element
                onDeleteNote(note.id); // Call the onDelete prop here
              }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemButton>
        ))}
        <ListItem>
          <Button onClick={onAddNewPage}>
            <ListItemText primary="Add new page" />
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
