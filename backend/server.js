const express = require('express');
const cors = require('cors');
const pageController = require('./controllers/pageController');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.post('/databse/pages', (req, res) => {
  pageController.createNewPage(req.body.title, (err, page) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(page);
    }
  });
});

app.get('/database/pages', (req, res) => {
  pageController.getAllPages((err, pages) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(pages);
    }
  });
});

app.put('/database/pages/:id', (req, res) => {
  pageController.updatePageById(req.params.id, req.body.title, (err, page) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(page);
    }
  });
});

app.delete('/database/pages/:id', (req, res) => {
  pageController.deletePageById(req.params.id, (err, page) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(page);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
