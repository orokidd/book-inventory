const db = require("../db/queries");

async function genreGet(req, res) {
    const genres = await db.getAllGenres();
    res.render("genres", { genres })
}

async function newGenreGet(req, res) {
    res.render("newGenre")
}

async function newGenrePost(req, res) {
    const { genre_name } = req.body
    await db.addNewGenre(genre_name);
    res.redirect("/genres")
}

module.exports = {
    genreGet,
    newGenreGet,
    newGenrePost
}