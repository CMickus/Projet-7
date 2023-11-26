const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/wepb': 'webp'
};

const storage =  multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => { 
    const name = path.basename(file.originalname, path.extname(file.originalname));
    
    const extension = MIME_TYPES[file.mimetype];
    console.log(name)
    callback(null,name + Date.now() + '.' + 'webp');
  }
});

module.exports = multer({storage: storage}).single('image');