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
      COALESCE(ARRAY_AGG(genres.name) FILTER (WHERE genres.name IS NOT NULL), '{}') AS genres
    FROM books
    LEFT JOIN book_genres ON books.id = book_genres.book_id
    LEFT JOIN genres ON book_genres.genre_id = genres.id
    WHERE books.id IN (
      SELECT book_genres.book_id
      FROM book_genres
      JOIN genres ON book_genres.genre_id = genres.id
      WHERE genres.name = $1
    )
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

// Get a single genre with all its books
async function getGenreWithBooks(genreId) {
  const genreQuery = `
    SELECT id, name, description
    FROM genres
    WHERE id = $1;
  `;
  const genreResult = await pool.query(genreQuery, [genreId]);

  if (genreResult.rows.length === 0) {
    return null;
  }

  const genre = genreResult.rows[0];
  const books = await getBooksByGenre(genre.name);

  return { ...genre, books };
}

module.exports = {
  getAllBooks,
  getBooksByGenre,
  getAllGenres,
  getGenreWithBooks,
};
