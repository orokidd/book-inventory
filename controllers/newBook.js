const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

async function newBookGet(req, res) {
    const genres = await db.getAllGenres();
    res.render("./newBook/newBook", { genres, previous: {} })
}

const addBook = [
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required.")
        .isLength({ max: 255 }).withMessage("Title must be at most 255 characters long."),
    body("author")
        .trim()
        .notEmpty().withMessage("Author is required.")
        .isLength({ max: 255 }).withMessage("Author must be at most 255 characters long."),
    body("published_year")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Published year must be a valid year."),
    body("isbn")
        .trim()
        .optional({ checkFalsy: true })
        .isLength({ max: 13 }).withMessage("ISBN must be at most 13 characters long."),
    body("description")
        .trim()
        .optional({ checkFalsy: true }),
    body("pages")
        .optional({ checkFalsy: true })
        .isInt({ min: 1 }).withMessage("Pages must be a positive number."),
    body("stock")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Stock must be a non-negative number."),
    body("image_url")
        .trim()
        .optional({ checkFalsy: true })
        .isURL().withMessage("Image URL must be a valid URL."),
    body("admin_password")
        .trim()
        .notEmpty().withMessage("Admin password is required.")
        .custom((value) => {
            if (value !== process.env.ADMIN_PASSWORD) {
                throw new Error("Wrong password. Please try again.");
            }
            return true;
        }),

    async (req, res) => {
        const { title, author, published_year, isbn, description, pages, stock, image_url, genres } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const allGenres = await db.getAllGenres();
            return res.render("./newBook/newBook", { genres: allGenres, previous: req.body, errors: errors.array() });
        }

        try {
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

            if (genres) {
                // Convert array of genre IDs from strings to integers ["1", "2"] -> [1, 2]
                const genreIds = Array.isArray(genres) ? genres.map((id) => parseInt(id)) : [parseInt(genres)]; 
                await db.addGenresToBook(book.id, genreIds);
            }

            res.redirect("/");
        } catch (error) {
            console.error("Error adding book:", error);
            res.status(500).send("Error adding book");
        }
    }
];

module.exports = {
    newBookGet,
    addBook
}

// async function addBook(req, res) {
//   const { title, author, published_year, isbn, description, pages, stock, image_url, genres, admin_password } = req.body;

//   try {
//     // Use the existing addBook function from queries.js
//     const book = await db.addBook({
//       title,
//       author,
//       published_year,
//       isbn,
//       description,
//       pages,
//       stock,
//       image_url,
//     });

//     // Use the existing addGenresToBook function from queries.js
//     if (genres) {
//       const genreIds = Array.isArray(genres) ? genres.map((id) => parseInt(id)) : [parseInt(genres)];
//       await db.addGenresToBook(book.id, genreIds);
//     }

//     res.redirect("/");
//   } catch (error) {
//     console.error("Error adding book:", error);
//     res.status(500).send("Error adding book");
//   }
// }