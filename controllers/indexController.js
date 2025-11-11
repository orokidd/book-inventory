const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

async function indexGet(req, res) {
  const { genreName } = req.query;

  let books;
  let selectedGenre = "";

  if (genreName && genreName !== "") {
    books = await db.getBooksByGenre(genreName);
    selectedGenre = genreName;
  } else {
    books = await db.getAllBooks();
  }

  //   const books = await db.getAllBooks();
  const allGenres = await db.getAllGenres();

  res.render("./index/index", { books, allGenres, selectedGenre, showDeleteFailedModal: false });
}

module.exports = {
  indexGet
};

// async function bookDeleteGet(req, res) {
//   const bookId = req.params.bookId;
//   const book = await db.getBookById(bookId);
//   const bookTitle = book.title;
//   res.render("deleteBook", { bookId, bookTitle });
// }

// const bookDeletePost = [
//   body("admin_password")
//     .trim()
//     .notEmpty().withMessage("Password is required.")
//     .custom((value) => {
//       if (value !== process.env.ADMIN_PASSWORD) {
//         throw new Error("Wrong password. Please try again.");
//       }
//       return true;
//     }),

//   async (req, res) => {
//     const bookId = req.params.bookId;
//     const book = await db.getBookById(bookId);
//     const bookTitle = book.title;
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.render("deleteBook", {
//         bookId,
//         bookTitle,
//         errors: errors.array(),
//       });
//     }

//     await db.deleteBookById(bookId);
//     res.redirect("/");
//   },
// ];