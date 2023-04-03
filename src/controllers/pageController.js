const Page = require('../models/pageModel');

const createNewPage = (title, callback) => {
  const page = new Page({ title });
  page.save(callback);
};

const getAllPages = (callback) => {
  Page.find({}, callback);
};

const updatePageById = (id, newTitle, callback) => {
  Page.findByIdAndUpdate(id, { title: newTitle }, { new: true }, callback);
};

const deletePageById = (id, callback) => {
  Page.findByIdAndDelete(id, callback);
};

module.exports = {
createNewPage,
getAllPages,
updatePageById,
deletePageById,
};
