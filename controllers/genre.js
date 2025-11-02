const db = require("../db/queries");

async function genreGet(req, res) {
    const genres = await db.getAllGenres();
    res.render("genres", { genres })
}

async function newGenreGet(req, res) {
    res.render("newGenre")
}

module.exports = {
    genreGet,
    newGenreGet
}