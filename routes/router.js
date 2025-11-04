const { Router } = require('express');
const router = Router();

const indexController = require('../controllers/indexController')
const newBookController = require('../controllers/newBook')
const editBookController = require('../controllers/editBook')
const genreController = require('../controllers/genre')

router.get('/', indexController.indexGet)

router.get('/newbook', newBookController.newBookGet)
router.post('/newbook', newBookController.addBook)

router.get('/genres', genreController.genreGet)
router.get('/genres/newgenre', genreController.newGenreGet)
router.post('/genres/newgenre', genreController.newGenrePost)
router.get('/genres/:genreId/delete', genreController.deleteGenreGet)
router.post('/genres/:genreId/delete', genreController.deleteGenrePost)

router.get('/:bookId', indexController.bookDetailsGet)

router.get('/:bookId/delete', indexController.bookDeleteGet)
router.post('/:bookId/delete', indexController.bookDeletePost)

router.get('/:bookId/edit', editBookController.editBookGet)
router.post('/:bookId/edit', editBookController.editBookPost)

module.exports = router;