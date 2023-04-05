const express = require('express');
const router = express.Router();
const pageController = require('./controllers/pageController');


// Get all pages
router.get('/mythic.db/pages/', (req, res) => {
  pageController.getAllPages((err, pages) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(pages);
    }
  });
});

// Create a new page
router.post('/mythic.db/pages', (req, res) => {
  const { title, content } = req.body;
  pageController.createNewPage(title, content, (err, page) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json(page);
    }
  });
});

// Update a page by ID
router.put('/mythic.db/pages/:id', (req, res) => {
  const { title, content } = req.body;
  const id = req.params.id;
  pageController.updatePageById(id, title, content, (err, updatedPage) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(updatedPage);
    }
  });
});

// Get a page by ID
router.get('/mythic.db/pages/:id', (req, res) => {
  const id = req.params.id;
  pageController.getPageById(id, (err, page) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(page);
    }
  });
});

// Delete a page by ID
router.delete('/mythic.db/pages/:id', (req, res) => {
  const id = req.params.id;
  pageController.deletePageById(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(204).send(); // 204 No Content for successful delete
    }
  });
});

module.exports = router;

