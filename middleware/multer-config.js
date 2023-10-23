const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

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
  filename: (req, file, callback) => { //rajouter async si on reactive sharp
    const name = path.basename(file.originalname, path.extname(file.originalname));
    /*await sharp(req.file)
      .webp({ quality: 20 })
      .resize(200)
      .toFile(`${name}.webp`)*/
    const extension = MIME_TYPES[file.mimetype];
    console.log(name)
    callback(null, Date.now() + name + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');