const db = require("../db/queries");

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

  const allGenres = await db.getAllGenres();

  res.render("./index/index", { books, allGenres, selectedGenre, showDeleteFailedModal: false });
}

module.exports = {
  indexGet,
};