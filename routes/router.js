const { Router } = require('express');
const router = Router();

const indexController = require('../controllers/indexController')
const newBookController = require('../controllers/newBook')

router.get('/', indexController.indexGet)
router.get('/:bookId', indexController.bookDetailsGet)

router.get('/newbook', newBookController.newBookGet)
router.post('/newbook', newBookController.addBook)

module.exports = router;