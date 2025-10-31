const db = require("../db/queries");

async function indexGet(req, res) {
  const books = await db.getAllBooks();
  res.render("index", { books });
}

async function bookDetailsGet(req, res) {
    const selectedBookId = req.params.bookId;
    const book = await db.getBookById(selectedBookId)
    res.render("bookDetails", { book })
}

module.exports = {
  indexGet,
  bookDetailsGet
};
