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

async function deleteGenreGet(req, res) {
    const genreId = req.params.genreId;
    const genreName =  await db.getGenreNameById(genreId);
    res.render("deleteGenre", { genreName, genreId });
}

async function deleteGenrePost(req, res) {
    const genreId = req.params.genreId;
    const adminPassword = req.body.admin_password;

    // Simple password check (in a real app, use proper authentication)
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(403).send("Forbidden: Incorrect admin password");
    }
    await db.deleteGenreById(genreId);
    res.redirect("/genres");
}

module.exports = {
    genreGet,
    newGenreGet,
    newGenrePost,
    deleteGenrePost,
    deleteGenreGet
}