const db = require('./database');

// Function to create a new tag
const createTag = (name, callback) => {
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const sql = 'INSERT INTO tags (name, createdAt, updatedAt) VALUES (?, ?, ?)';
  db.run(sql, [name, createdAt, updatedAt], function (err) {
    if (err) {
      return callback(err);
    }
    callback(null, { id: this.lastID, name, createdAt, updatedAt });
  });
};

// Export the createTag function
module.exports = {
  createTag,
};
