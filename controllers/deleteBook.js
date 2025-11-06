const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

async function bookDeleteGet(req,res) {
    const bookId = req.params.bookId;
    const book = await db.getBookById(bookId);
    const bookTitle = book.title;
    res.render("deleteBook", { bookId, bookTitle });
}

const bookDeletePost = [
  body("admin_password")
    .trim()
    .notEmpty().withMessage("Password is required.")
    .custom((value) => {
      if (value !== process.env.ADMIN_PASSWORD) {
        throw new Error("Wrong password. Please try again.");
      }
      return true;
    }),

  async (req, res) => {
    const bookId = req.params.bookId;
    const book = await db.getBookById(bookId);
    const bookTitle = book.title;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("deleteBook", {
        bookId,
        bookTitle,
        errors: errors.array(),
      });
    }

    await db.deleteBookById(bookId);
    res.redirect("/");
  },
];

module.exports = {
    bookDeleteGet,
    bookDeletePost
}