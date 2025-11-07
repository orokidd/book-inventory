const db = require("../db/queries");

async function bookDetailsGet(req, res) {
    const selectedBookId = req.params.bookId;
    const book = await db.getBookById(selectedBookId);
    res.render("bookDetails", { book });
}

module.exports = {
    bookDetailsGet
}