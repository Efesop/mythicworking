
const db = require('../../database/database');

const getAllPages = (callback) => {
  db.all('SELECT * FROM pages', (err, rows) => {
    callback(err, rows);
  });
};

const createNewPage = (title, content, callback) => {
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const sql = `INSERT INTO pages (title, content, createdAt, updatedAt) VALUES (?, ?, ?, ?)`;
  db.run(sql, [title, JSON.stringify(content), createdAt, updatedAt], function (err) {
    if (err) {
      callback(err);
    } else {
      db.get('SELECT * FROM pages WHERE id = ?', [this.lastID], callback);
    }
  });
};

const updatePageById = (id, newTitle, newContent, callback) => {
  const updatedAt = new Date().toISOString();
  const sql = `UPDATE pages SET title = ?, content = ?, updatedAt = ? WHERE id = ?`;

  db.run(sql, [newTitle, JSON.stringify(newContent), updatedAt, id], (err) => {
    if (err) {
      callback(err);
    } else {
      db.get('SELECT * FROM pages WHERE id = ?', [id], callback);
    }
  });
};

const getPageById = (id, callback) => {
  db.get('SELECT * FROM pages WHERE id = ?', [id], (err, row) => {
    if (row) {
      row.content = JSON.parse(row.content);
    }
    callback(err, row);
  });
};

const deletePageById = (id, callback) => {
  db.run('DELETE FROM pages WHERE id = ?', [id], callback);
};

module.exports = {
  createNewPage,
  getAllPages,
  updatePageById,
  deletePageById,
  getPageById,
};

