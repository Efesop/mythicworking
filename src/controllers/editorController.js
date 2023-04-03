// editorController.js
const PageModel = require('../database/pageModel');

exports.saveData = async (req, res) => {
  try {
    const data = req.body;

    // Save or update the data in your database
    // Replace with your own logic for creating/updating pages
    const page = await PageModel.create({
      data: JSON.stringify(data),
    });

    res.status(200).json({
      message: 'Data saved successfully',
      page,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error saving data',
      error,
    });
  }
};
