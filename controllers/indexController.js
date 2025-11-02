const db = require("../db/queries");

async function indexGet(req, res) {
  const { genreName } = req.query;

  let books;
  let selectedGenre = "";

  if (genreName && genreName !== "") {
    books = await db.getBooksByGenre(genreName);
    selectedGenre = genreName;
  } 
  
  else {
    books = await db.getAllBooks();
  }

  //   const books = await db.getAllBooks();
  const allGenres = await db.getAllGenres();

  res.render("index", { books, allGenres, selectedGenre });
}

async function bookDetailsGet(req, res) {
  const selectedBookId = req.params.bookId;
  const book = await db.getBookById(selectedBookId);
  res.render("bookDetails", { book });
}

async function bookDeletePost(req, res) {
  const bookId = req.params.bookId;
  await db.deleteBookById(bookId);
  res.redirect("/");
}

module.exports = {
  indexGet,
  bookDetailsGet,
  bookDeletePost,
};
