const db = require("../db/queries");

async function bookDetailsGet(req, res) {
  const selectedBookId = req.params.bookId;
  const book = await db.getBookById(selectedBookId);
  res.render("./book-details/book-details", { book, showDeleteFailedModal: false });
}

module.exports = {
  bookDetailsGet,
};
