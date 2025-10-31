const db = require("../db/queries");

async function newBookGet(req, res) {
    const genres = await db.getAllGenres();
    res.render("newBook", { genres })
}

module.exports = {
    newBookGet
}