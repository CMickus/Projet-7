const express = require('express');
const router = express.Router();
const BookCtrl = require('../controllers/Book');
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const sharpimage = require('../middleware/sharpimage')

router.get('/', BookCtrl.getAllBooks);
router.post('/', auth, multer, sharpimage, BookCtrl.createBook);
router.post('/:id/rating', auth, BookCtrl.rateBook);
router.get('/bestrating', BookCtrl.getBestBooks);
router.get('/:id', BookCtrl.getOneBook);
router.put('/:id', auth, multer, sharpimage, BookCtrl.modifyBook);
router.delete('/:id', auth, BookCtrl.deleteBook);


module.exports = router;