import React from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

function FloatingActionButton() {
  return (
    <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: '15px', right: '15px' }}>
      <AddIcon />
    </Fab>
  );
}

export default FloatingActionButton;
