const db = require("../db/queries");

async function indexGet(req, res) {
    const books = await db.getAllBooks();
    res.render('index', { books })
}

module.exports = {
    indexGet
}