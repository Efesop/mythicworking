const sqlite3 = require('sqlite3').verbose();

// Create a new database file or open an existing one
const db = new sqlite3.Database('./mythic.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the mythic database.');
});

// Create the tags table
db.run(
  `CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    createdAt TEXT,
    updatedAt TEXT
  )`
);

// Create the pages table
db.run(
  `CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt TEXT,
    updatedAt TEXT
  )`
);

// Create a table to store the relationship between pages and tags
db.run(
  `CREATE TABLE IF NOT EXISTS page_tags (
    page_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY (page_id) REFERENCES pages (id),
    FOREIGN KEY (tag_id) REFERENCES tags (id),
    PRIMARY KEY (page_id, tag_id)
  )`
);

// Create the blocks table
db.run(
  `CREATE TABLE IF NOT EXISTS blocks (
    id INTEGER PRIMARY KEY,
    pageId INTEGER NOT NULL,
    type TEXT NOT NULL,
    content TEXT,
    sort_order INTEGER,
    parentId INTEGER,
    createdAt TEXT,
    updatedAt TEXT,
    FOREIGN KEY (pageId) REFERENCES pages (id),
    FOREIGN KEY (parentId) REFERENCES blocks (id)
  )`
);

// Create the tags table
db.run(`CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
)`);

// Create the blocks table
db.run(`CREATE TABLE IF NOT EXISTS blocks (
  id INTEGER PRIMARY KEY,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  pageId INTEGER,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (pageId) REFERENCES pages (id) ON DELETE CASCADE
)`);

module.exports = db;
