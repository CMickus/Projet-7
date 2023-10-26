const Book = require('../models/Book');
const fs = require('fs');
const sharp = require('sharp');
//const validator = require('string-validators');
//const isEmpty = require('string-validators');

//trovuer un autre moyen de faire les validations
exports.createBook = async (req, res, next) => {
    const BookObject = JSON.parse(req.body.book);
    delete BookObject._id;
    delete BookObject._userId;
    /*const optimized = await sharp(req.file)
        .webp({ quality: 20 })
        .resize(200)
        .toFile(`${req.file.filename}.webp`)
        .then(console.log(info))
        .catch(console.log(err))*/
    //verifier la construction du nom
    console.log(BookObject)
    if (BookObject.title.length != 0 && BookObject.genre.length != 0 && BookObject.year != null && BookObject.author.length != 0) {
        //console.log(optimized.filename)
        const book = new Book({
            ...BookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,// verifier l'url
            ratings: [],
            averageRating: 0,
        });
        book.save()
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
    } else {
        return res.status(401).json({ error: `Le titre le genre l'année et l'autheur ne peuvent pas être vide` })
    }
};


// non fonctionel j'ai mal compris comment sont pris les paramètres visiblement et comment ils sont envoyer
exports.rateBook = (req, res, next) => {
    /*const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };*/
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            //find simple d'un userId
            if (!book) {
                return res.status(404).json({ error: error })
            }
            const ThatBook = book.ratings.find((user) => user.userId === req.auth.userId)
            console.log(ThatBook, 'thatbook', req.auth.userId)
            if (ThatBook === undefined) {
                console.log('undefined', req.auth.userId)
                book.ratings.push({ userId: req.auth.userId, grade: req.body.rating })
            } else {
                const ThatBookIndex = book.ratings.findIndex((user) => user.userId === req.auth.userId)
                console.log(ThatBookIndex, 'thatindex');
                delete book.ratings[ThatBookIndex]
                book.ratings.push({ userId: req.auth.userId, grade: req.body.rating })
                console.log(book, 'thatnewbook')
            }
            //corriger average en conséquance
            let average = 0
            for (let i = 0; i < book.ratings.length; i++) {
                average = average + book.ratings[i].grade
            };
            average = average / book.ratings.length;
            book.averagerating = average;
            console.log(book)
            //const average = (ratings.grade.reduce((partialSum, a) => partialSum + a, 0))/ratings.length

            book.save()
                .then(() => res.status(201).json({ message: 'Objet modifié!' }))
                .catch(error => res.status(401).json({ error }));

        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({
        _id: req.params.id
    })
        .then(() => {
            if (Book != null) {
                res.status(200).json(Book);
            } else {
                res.status(404).json;
            }
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
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ error: error })
            }
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: 'Not authorized' });
            } else if (req.title.length === 0 && req.genre.length === 0 && req.year.length === 0 && req.author.length === 0) {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            } else {
                return res.status(401).json({ error: `Le titre, le genre, l'année, et/ou l'autheur ne peuvent pas être vide` })
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book === null) {
                res.status(404).json({ error: error });
            } else if (book.userId != req.auth.userId) {
                res.status(403).json({ message: 'Not authorized' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(403).json({ error }));
                });
            }
        })
        .catch(error => {
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
    /*const sortedBooks =[]
    for(let i = 0; i < Book.length; i++){
        sortedBooks.append(Book[i].averageRating)
    }
    console.log(sortedBooks)
    sortedBooks.sort((a,b)=>{return b - a})
    const bestBooks = [sortedBooks[0],sortedBooks[1],sortedBooks[2]]
        bestBooks.find().then(
        (bestBook) => {
            res.status(200).json(bestBook);
        }
        )
        .catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );*/
    Book.find().sort({ averagerating: 'desc' }).limit(3)
        .then((books) => {
            res.status(200).json(books);
        })
        .catch(() => { res.status(400).json({ error: 'error' }) })

};