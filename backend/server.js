const express = require('express');
const cors = require('cors');
const pageController = require('./controllers/pageController');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(require('./routes'));


// Routes
app.post('/pages', (req, res) => {
  pageController.createPage(req.body.title, (err, page) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(page);
    }
  });
});

app.get('/pages/:id', (req, res) => {
    pageController.getPageById(req.params.id, (err, page) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(page);
      }
    });
  });

  app.put('/pages/:id', (req, res) => {
  pageController.updatePageById(req.params.id, req.body.title, (err, page) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(page);
    }
  });
});

app.delete('/pages/:id', (req, res) => {
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
