const db = require('./database');

// Function to create a new block
const createBlock = (content, type, pageId, callback) => {
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const sql = 'INSERT INTO blocks (content, type, pageId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [content, type, pageId, createdAt, updatedAt], function (err) {
    if (err) {
      return callback(err);
    }
    callback(null, { id: this.lastID, content, type, pageId, createdAt, updatedAt });
  });
};

// Export the createBlock function
module.exports = {
  createBlock,
};
