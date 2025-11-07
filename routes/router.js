const { Router } = require('express');
const router = Router();

const indexController = require('../controllers/indexController')
const newBookController = require('../controllers/newBook')
const editBookController = require('../controllers/editBook')
const genreController = require('../controllers/genre')
const deleteBookController = require('../controllers/deleteBook')
const detailsBookController = require('../controllers/detailBook')

router.get('/', indexController.indexGet)

router.get('/newbook', newBookController.newBookGet)
router.post('/newbook', newBookController.addBook)

router.get('/genres', genreController.genreGet)
router.get('/genres/newgenre', genreController.newGenreGet)
router.post('/genres/newgenre', genreController.newGenrePost)
router.get('/genres/:genreId/delete', genreController.deleteGenreGet)
router.post('/genres/:genreId/delete', genreController.deleteGenrePost)

router.get('/:bookId', detailsBookController.bookDetailsGet)

router.get('/:bookId/delete', deleteBookController.bookDeleteGet)
router.post('/:bookId/delete', deleteBookController.bookDeletePost)

router.get('/:bookId/edit', editBookController.editBookGet)
router.post('/:bookId/edit', editBookController.editBookPost)

module.exports = router;