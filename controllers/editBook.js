const db = require("../db/queries");

async function editBookGet(req, res) {
  const selectedBookId = req.params.bookId;
  const book = await db.getBookById(selectedBookId);
  const genres = await db.getAllGenres();
  res.render("editBook", { book, genres});
}

module.exports = {
    editBookGet
}