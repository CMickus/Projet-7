const Book = require('../models/Book');
const fs = require('fs');
const sharp = require('sharp');

exports.createBook = async (req, res, next) => {
    const BookObject = JSON.parse(req.body.Book);
    delete BookObject._id;
    delete BookObject._userId;
    const optimized = await sharp(req.file)
        .webp({quality: 20})
        .resize(200, 200)
    const startRating = [{
        userId : "first",
        grade: 0,
    }]
    const Book = new Book({
        ...BookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${optimized.filename}`,
        ratings: startRating, 
        averageRating: 0,
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


// non fonctionel j'ai mal compris comment sont pris les paramètres visiblement et comment ils sont envoyer
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
                () =>{
                    let average = 0
                    for( let i = 1; i <= req.ratings.length; i++){
                        average = average + req.ratings[i].grade
                    }
                    average = average/req.ratings.length
                }
                //const average = (ratings.grade.reduce((partialSum, a) => partialSum + a, 0))/ratings.length
                ratings.append({userId: req.auth.userId, grade})
                Book.updateOne({ _id: req.params.id}, { ...bookObject, })
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

exports.getBestBooks = (req, res, next) => {
    const allBooks = new Array(Book.averageRating)
    allBooks.shift()
    let topBooks = allBooks.sort((a,b) => (b-a)).slice(0,3);
    topBooks.find().then(
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