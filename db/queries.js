// queries.js
const pool = require("./pool");

// Get all books with their genres
async function getAllBooks() {
  const query = `
    SELECT
      books.id,
      books.title,
      books.author,
      books.published_year,
      books.isbn,
      books.description,
      books.pages,
      books.stock,
      books.image_url,
      COALESCE(ARRAY_AGG(genres.name) FILTER (WHERE genres.name IS NOT NULL), '{}') AS genres
    FROM books
    LEFT JOIN book_genres ON books.id = book_genres.book_id
    LEFT JOIN genres ON book_genres.genre_id = genres.id
    GROUP BY books.id
    ORDER BY books.title;
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function getBookById(id) {
  const query = `
    SELECT
      books.id,
      books.title,
      books.author,
      books.published_year,
      books.isbn,
      books.description,
      books.pages,
      books.stock,
      books.image_url,
      COALESCE(ARRAY_AGG(genres.name) FILTER (WHERE genres.name IS NOT NULL), '{}') AS genres
    FROM books
    LEFT JOIN book_genres ON books.id = book_genres.book_id
    LEFT JOIN genres ON book_genres.genre_id = genres.id
    WHERE books.id = $1
    GROUP BY books.id
  `;
  
  const { rows } = await pool.query(query, [id]);
  return rows[0]; // since ID is unique, return the first result
}

async function deleteBookById(id) {
  // Delete the associations first
  await pool.query("DELETE FROM book_genres WHERE book_id = $1", [id]);

  // Then delete the book itself
  await pool.query("DELETE FROM books WHERE id = $1", [id]);
}

async function updateBook(id, data) {
  const { title, author, published_year, isbn, description, pages, stock, image_url, genres } = data;

  // Update main book data
  await pool.query(
    `UPDATE books
     SET title = $1, author = $2, published_year = $3, isbn = $4,
         description = $5, pages = $6, stock = $7, image_url = $8
     WHERE id = $9`,
    [title, author, published_year, isbn, description, pages, stock, image_url, id]
  );

  // Update genres relation
  await pool.query("DELETE FROM book_genres WHERE book_id = $1", [id]);

  for (const genreName of genres) {
    const genreRes = await pool.query("SELECT id FROM genres WHERE name = $1", [genreName]);
    const genreId = genreRes.rows[0].id;
    await pool.query("INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2)", [id, genreId]);
  }
}


// Get all books by a specific genre
async function getBooksByGenre(genreName) {
  const query = `
    SELECT
      books.id,
      books.title,
      books.author,
      books.published_year,
      books.isbn,
      books.description,
      books.pages,
      books.stock,
      books.image_url,
      COALESCE(ARRAY_AGG(genres.name) FILTER (WHERE genres.name IS NOT NULL), '{}') AS genres
    FROM books
    LEFT JOIN book_genres ON books.id = book_genres.book_id
    LEFT JOIN genres ON book_genres.genre_id = genres.id
    WHERE genres.name = $1
    GROUP BY books.id
    ORDER BY books.title;
  `;
  const { rows } = await pool.query(query, [genreName]);
  return rows;
}

// Get all genres
async function getAllGenres() {
  const query = `
    SELECT 
      genres.id,
      genres.name,
      genres.description,
      COUNT(book_genres.book_id) AS book_count
    FROM genres
    LEFT JOIN book_genres ON genres.id = book_genres.genre_id
    GROUP BY genres.id
    ORDER BY genres.name;
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function getGenreNameById(genreId) {
  const query = `SELECT name FROM genres WHERE id = $1;`;
  const { rows } = await pool.query(query, [genreId]);
  return rows.length > 0 ? rows[0].name : null;
}

async function addNewGenre(genreName) {
  const query = `INSERT INTO genres (name) VALUES ($1);`
  await pool.query(query, [genreName])
}

async function deleteGenreById(genreId) {
  // Delete associations first
  await pool.query("DELETE FROM book_genres WHERE genre_id = $1", [genreId]);
  // Then delete the genre itself
  await pool.query("DELETE FROM genres WHERE id = $1", [genreId]);
}

async function addBook(bookData) {
  const query = `
    INSERT INTO books (title, author, published_year, isbn, description, pages, stock, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [
    bookData.title,
    bookData.author,
    bookData.published_year || null,
    bookData.isbn || null,
    bookData.description || null,
    bookData.pages || null,
    bookData.stock || 0,
    bookData.image_url || null,
  ]);
  return rows[0];
}

async function addGenresToBook(bookId, genreIds) {
  if (!genreIds || genreIds.length === 0) {
    return [];
  }

  const values = genreIds.map((genreId, index) => 
    `($1, $${index + 2})`
  ).join(', ');

  const query = `
    INSERT INTO book_genres (book_id, genre_id)
    VALUES ${values}
    ON CONFLICT DO NOTHING
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [bookId, ...genreIds]);
  return rows;
}

module.exports = {
  getAllBooks,
  getBookById,
  getBooksByGenre,
  getAllGenres,
  addBook,
  addGenresToBook,
  deleteBookById,
  updateBook,
  addNewGenre,
  deleteGenreById,
  getGenreNameById
};
