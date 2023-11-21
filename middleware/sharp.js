const fs = require('fs');
const sharp = require("sharp");
const path = require('path');

module.exports= (req,res, next) => {
    if (req.file !== undefined) {
        fs.readFile(`images/${req.file.filename}`, async (err, image) => {
            if (err) {
                return callback(err);
            }            
            const newFilename = path.basename(req.file.originalname, path.extname(req.file.originalname))
            await sharp(image)
                .webp({ quality: 20 })
                .resize(200)
                .toFile("images/" + `${newFilename + Date.now()}.webp`);
            fs.unlink(`images/${req.file.filename}`, ()=>{
                delete image;
            })
            req.file.filename = newFilename            
            next();     
        });
    }
}