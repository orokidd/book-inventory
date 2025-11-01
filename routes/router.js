const { Router } = require('express');
const router = Router();

const indexController = require('../controllers/indexController')
const newBookController = require('../controllers/newBook')
const editBookController = require('../controllers/editBook')

router.get('/', indexController.indexGet)

router.get('/newbook', newBookController.newBookGet)
router.post('/newbook', newBookController.addBook)

router.get('/:bookId', indexController.bookDetailsGet)
router.post('/:bookId/delete', indexController.bookDeletePost)

router.get('/:bookId/edit', editBookController.editBookGet)
router.post('/:bookId/edit', editBookController.editBookPost)

module.exports = router;