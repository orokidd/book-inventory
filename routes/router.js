const { Router } = require('express');
const router = Router();

const indexController = require('../controllers/indexController')
const newBookController = require('../controllers/newBook')

router.get('/', indexController.indexGet)

// Place literal/static routes before dynamic parameter routes so
// `/newbook` is not captured by `/:bookId`.
router.get('/newbook', newBookController.newBookGet)
router.post('/newbook', newBookController.addBook)

// Dynamic book routes (bookId param)
router.get('/:bookId', indexController.bookDetailsGet)
router.post('/:bookId/delete', indexController.bookDeletePost)

module.exports = router;