const { createTag } = require('../database/tagModel');

const createNewTag = (name, callback) => {
  createTag(name, callback);
};

module.exports = {
  createNewTag,
};
