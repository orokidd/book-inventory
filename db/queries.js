const pool = require("./pool");

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
  return rows[0];
}

async function deleteBookById(id) {
  await pool.query("DELETE FROM book_genres WHERE book_id = $1", [id]);
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
  for (const genreId of genreIds) {
    await pool.query("INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [bookId, genreId]);
  }
}

async function addGenresToBookByNames(bookId, genreNames) {
  for (const genreName of genreNames) {
    const genreRes = await pool.query("SELECT id FROM genres WHERE name = $1", [genreName]);
    const genreId = genreRes.rows[0].id;
    await pool.query("INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [bookId, genreId]);
  }
}

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
    GROUP BY books.id
    HAVING $1 = ANY(ARRAY_AGG(genres.name))
    ORDER BY books.title;
  `;
  const { rows } = await pool.query(query, [genreName]);
  return rows;
}

async function getGenreNameById(genreId) {
  const query = `SELECT name FROM genres WHERE id = $1;`;
  const { rows } = await pool.query(query, [genreId]);
  return rows.length > 0 ? rows[0].name : null;
}

async function addNewGenre(genreName) {
  const query = `INSERT INTO genres (name) VALUES ($1);`;
  await pool.query(query, [genreName]);
}

async function deleteGenreById(genreId) {
  await pool.query("DELETE FROM book_genres WHERE genre_id = $1", [genreId]);
  await pool.query("DELETE FROM genres WHERE id = $1", [genreId]);
}

module.exports = {
  getAllBooks,
  getBookById,
  getBooksByGenre,
  getAllGenres,
  addBook,
  addGenresToBook,
  addGenresToBookByNames,
  deleteBookById,
  updateBook,
  addNewGenre,
  deleteGenreById,
  getGenreNameById,
};
