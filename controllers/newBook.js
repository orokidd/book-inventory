const db = require("../db/queries");

async function newBookGet(req, res) {
    const genres = await db.getAllGenres();
    res.render("newBook", { genres })
}

async function addBook(req, res) {
  const { title, author, published_year, isbn, description, pages, stock, image_url, genres } = req.body;

  try {
    // Use the existing addBook function from queries.js
    const book = await db.addBook({
      title,
      author,
      published_year,
      isbn,
      description,
      pages,
      stock,
      image_url,
    });

    // Use the existing addGenresToBook function from queries.js
    if (genres) {
      const genreIds = Array.isArray(genres) ? genres.map((id) => parseInt(id)) : [parseInt(genres)];
      await db.addGenresToBook(book.id, genreIds);
    }

    res.redirect("/");
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).send("Error adding book");
  }
}

module.exports = {
    newBookGet,
    addBook
}