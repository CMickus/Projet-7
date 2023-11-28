const fs = require('fs');
const sharp = require("sharp");
const path = require('path');

module.exports= (req, res, next) => {
    if (req.file !== undefined) {
        fs.readFile(`images/${req.file.filename}`, async (err, image) => {
            if (err) {
                return callback(err);
            }            
            const newFilename = path.basename(req.file.originalname,path.extname(req.file.originalname)) + Date.now() + `.webp`
            await sharp(image)
                .avif({ quality: 20 })
                .resize(200)
                .toFile("images/" + `${newFilename}`);
            fs.unlink(`images/${req.file.filename}`, ()=>{
                delete image;
            })
            req.file.filename = newFilename 
            console.log("********",req.file.filename)        
            next();     
        });
    } else {
        console.log("******** next")        
        next();
    }
}