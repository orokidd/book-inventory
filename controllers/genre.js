const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

async function genreGet(req, res) {
  const genres = await db.getAllGenres();
  res.render("genres", { genres });
}

async function newGenreGet(req, res) {
  res.render("newGenre");
}

async function newGenrePost(req, res) {
  const { genre_name } = req.body;
  await db.addNewGenre(genre_name);
  res.redirect("/genres");
}

async function deleteGenreGet(req, res) {
  const genreId = req.params.genreId;
  const genreName = await db.getGenreNameById(genreId);
  res.render("deleteGenre", { genreName, genreId });
}

const deleteGenrePost = [
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
    const genreId = req.params.genreId;
    const genreName = await db.getGenreNameById(genreId);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("deleteGenre", {
        genreId,
        genreName,
        errors: errors.array(),
      });
    }

    await db.deleteGenreById(genreId);
    res.redirect("/genres");
  },
];

module.exports = {
  genreGet,
  newGenreGet,
  newGenrePost,
  deleteGenrePost,
  deleteGenreGet,
};
