const db = require('./database');

// Function to create a new page
const createPage = (title, callback) => {
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const sql = 'INSERT INTO pages (title, createdAt, updatedAt) VALUES (?, ?, ?)';
  db.run(sql, [title, createdAt, updatedAt], function (err) {
    if (err) {
      return callback(err);
    }
    callback(null, { id: this.lastID, title, createdAt, updatedAt });
  });
};

// Export the createPage function
module.exports = {
  createPage,
};
