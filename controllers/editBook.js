const db = require("../db/queries");

async function editBookGet(req, res) {
  const selectedBookId = req.params.bookId;
  const book = await db.getBookById(selectedBookId);
  const genres = await db.getAllGenres();
  res.render("editBook", { book, genres });
}

async function editBookPost(req, res) {
  const bookId = req.params.bookId;
  let { title, author, published_year, isbn, description, pages, stock, image_url, genres } = req.body;

  if (!Array.isArray(genres)) {
    genres = [genres]; // in case only one checkbox is checked
  }

  try {
    await db.updateBook(bookId, { title, author, published_year, isbn, description, pages, stock, image_url, genres });
    res.redirect(`/${bookId}`);
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).send("Error updating book");
  }
}

module.exports = {
  editBookGet,
  editBookPost,
};
