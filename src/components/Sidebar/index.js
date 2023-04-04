import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const Sidebar = ({ drawerOpen, toggleDrawer, onPageClick, onDeleteNote, notes, onAddNewPage }) => {
  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={toggleDrawer}
      variant="temporary"
    >
      <List>
        {notes.map((note) => (
          <ListItem key={note.id}>
          <ListItemText
            primary={note.title}
            onClick={() => onPageClick(note.id)}
          />
          <IconButton edge="end" aria-label="delete" onClick={() => onDeleteNote(note.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
        ))}
        <ListItem>
          <ListItemText primary="Add new page" onClick={onAddNewPage} />
        </ListItem>
      </List>
    </Drawer>
  );
};


export default Sidebar;
