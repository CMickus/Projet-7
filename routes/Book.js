const express = require('express');
const router = express.Router();
const BookCtrl = require('../controllers/Book');
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

router.get('/', BookCtrl.getAllBooks);
router.post('/', auth, multer, BookCtrl.createBook);
router.post('/', auth, BookCtrl.rateBook)
router.get('/:id', BookCtrl.getOneBook);
router.get('/bestrating', BookCtrl.getBestBooks);
router.put('/:id', auth, multer, BookCtrl.modifyBook);
router.delete('/:id', auth, BookCtrl.deleteBook);


module.exports = router;