const { Router } = require('express');
const router = Router();

const indexController = require('../controllers/indexController')
const newBookController = require('../controllers/newBook')

router.get('/', indexController.indexGet)
router.get('/newbook', newBookController.newBookGet)

module.exports = router;