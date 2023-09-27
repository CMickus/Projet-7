const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/Book');


const app = express();

mongoose.connect('mongodb+srv://CMickus:m39u2zu7FuMk4WoT@cluster0.xasfo6b.mongodb.net/',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.get('/api/stuff', (req, res, next) => {
    Book.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
  });

  app.post('/api/stuff', (req, res, next) => {
    delete req.body._id;
    const thing = new Book({
      ...req.body
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });
module.exports = app;