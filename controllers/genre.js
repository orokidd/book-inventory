const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

async function genreGet(req, res) {
  const genres = await db.getAllGenres();
  res.render("./genres/genres", { genres, showDeleteFailedModal: false });
}

async function newGenreGet(req, res) {
  res.render("./genres/newGenre");
}

const newGenrePost = [
  body("genre_name")
    .trim()
    .notEmpty().withMessage("Genre name is required.")
    .isLength({ max: 100 }).withMessage("Genre name must be at most 100 characters long."),

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
    const genreName = req.body.genre_name;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("newGenre", {
        genreName,
        errors: errors.array(),
      });
    }

    await db.addNewGenre(genreName);
    res.redirect("/genres");
  },
];

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
    const allGenres = await db.getAllGenres();
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("./genres/genres", {
        genres: allGenres,
        showDeleteFailedModal: true,
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
};