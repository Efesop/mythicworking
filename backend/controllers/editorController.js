// editorController.js
const pageController = require('../controllers/pageController');

exports.saveData = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Save or update the data in your database
    // Replace with your own logic for creating/updating pages
    pageController.createPage(title, content, (err, page) => { // update this line
      if (err) {
        res.status(500).json({
          message: 'Error saving data',
          error: err,
        });
      } else {
        res.status(200).json({
          message: 'Data saved successfully',
          page,
        });
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error saving data',
      error,
    });
  }
};
