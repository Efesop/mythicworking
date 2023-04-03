const { createBlock } = require('../database/blockModel');

const createNewBlock = (content, type, pageId, callback) => {
  createBlock(content, type, pageId, callback);
};

module.exports = {
  createNewBlock,
};
