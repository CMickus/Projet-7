const express = require('express');
const router = express.Router();
const BookCtrl = require('../controllers/Book');
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const sharp = require('../middleware/sharp')

router.get('/', BookCtrl.getAllBooks);
router.post('/', auth, multer, sharp, BookCtrl.createBook);
router.post('/:id/rating', auth, BookCtrl.rateBook);
router.get('/bestrating', BookCtrl.getBestBooks);
router.get('/:id', BookCtrl.getOneBook);
router.put('/:id', auth, multer, sharp, BookCtrl.modifyBook);
router.delete('/:id', auth, BookCtrl.deleteBook);


module.exports = router;