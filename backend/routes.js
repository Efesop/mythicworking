// routes.js
const express = require('express');
const router = express.Router();
const editorController = require('..database/editorController');

router.post('/save-editor-data', editorController.saveData);
// In your routes file
router.get('/fetch-saved-editor-data/:pageKey', editorController.fetchData);

// In your editorController.js
exports.fetchData = async (req, res) => {
  try {
    const pageKey = req.params.pageKey;

    // Fetch the data from your database based on the pageKey
    // Replace with your own logic for fetching pages
    const page = await PageModel.findOne({ pageKey });

    res.status(200).json({
      message: 'Data fetched successfully',
      data: JSON.parse(page.data),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching data',
      error,
    });
  }
};


module.exports = router;
