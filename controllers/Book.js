const Book = require('../models/Book');
const fs = require('fs');
const sharp = require('sharp');

exports.createBook = /*async*/ (req, res, next) => {
    const BookObject = JSON.parse(req.body.Book);
    delete BookObject._id;
    delete BookObject._userId;
    const { buffer, originalname } = req.file;
    /*await sharp(buffer)
        .webp({quality: 20})*/
    const Book = new Book({
        ...BookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        /*ratings:[]
        averageRating: 0 */
    });
    Book.save()
    .then(
        () => {
            res.status(201).json({
                message: 'Post saved successfully!'
            });
        }
    )
    .catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.rateBook = (req, res, next) =>{
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    Book.findOne({_id: req.params.id},{ratings[{userId}]: req.params._userId})
        .then((book) => {
            if (book.rating[userId] = req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                const average = (ratings.grade.reduce((partialSum, a) => partialSum + a, 0))/ratings.length
                Book.updateOne({ _id: req.params.id}, { ...bookObject, ratings.append({userId: req.auth.userId, rating})})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({
        _id: req.params.id
    }).then(
        (Book) => {
            res.status(200).json(Book);
        }
    )
    .catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

 exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };
exports.getAllBooks = (req, res, next) => {
    Book.find().then(
        (Books) => {
            res.status(200).json(Books);
        }
    )
    .catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};