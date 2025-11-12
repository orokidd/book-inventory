const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

async function editBookGet(req, res) {
  const selectedBookId = req.params.bookId;
  const sourcePage = req.query.from;
  
  const book = await db.getBookById(selectedBookId);
  const genres = await db.getAllGenres();

  res.render("./editBook/editBook", { book, genres, sourcePage });
}

const editBookPost = [
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
        .isLength({ max: 20 }).withMessage("ISBN must be at most 20 characters long."),
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
        const bookId = req.params.bookId;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const allGenres = await db.getAllGenres();
            return res.render("./editBook/editBook", { book: req.body, genres: allGenres, errors: errors.array() });
        }

        try {
            await db.updateBook(bookId, {
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
                await db.addGenresToBookByNames(bookId, genres);
            }

            res.redirect("/");
        } catch (error) {
            console.error("Error adding book:", error);
            res.status(500).send("Error adding book");
        }
    }
];

module.exports = {
  editBookGet,
  editBookPost,
};

// async function editBookPost(req, res) {
//   const bookId = req.params.bookId;
//   let { title, author, published_year, isbn, description, pages, stock, image_url, genres } = req.body;

//   if (!Array.isArray(genres)) {
//     genres = [genres]; // in case only one checkbox is checked
//   }

//   try {
//     await db.updateBook(bookId, { title, author, published_year, isbn, description, pages, stock, image_url, genres });
//     res.redirect(`/${bookId}`);
//   } catch (err) {
//     console.error("Error updating book:", err);
//     res.status(500).send("Error updating book");
//   }
// }