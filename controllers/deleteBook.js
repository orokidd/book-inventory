const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

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
    const errors = validationResult(req);
    const sourcePage = req.query.from;

    if (!errors.isEmpty()) {
      if (sourcePage === "details") {
        const book = await db.getBookById(bookId);
        return res.render("./bookDetails/bookDetails", {
          book,
          showDeleteFailedModal: true,
          errors: errors.array(),
        });
      }

      const allBooks = await db.getAllBooks();
      const allGenres = await db.getAllGenres();
      return res.render("./index/index", {
        books: allBooks,
        allGenres,
        showDeleteFailedModal: true,
        errors: errors.array(),
        selectedGenre: "",
      });
    }

    await db.deleteBookById(bookId);
    res.redirect("/");
  },
];

module.exports = {
    bookDeletePost
}