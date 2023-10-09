const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const BookRoutes = require('./routes/Book')
const userRoutes = require('./routes/User');
const path = require('path');
require('dotenv').config


const app = express();
// catch les erreurs d'end point
mongoose.connect(`mongodb+srv://CMickus:${process.env.MONGO_KEY}@cluster0.xasfo6b.mongodb.net/`,
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

//app.use(bodyParser.json())

  app.use('/api/Book', BookRoutes)
  app.use('/api/auth', userRoutes);

  app.use('/images', express.static(path.join(__dirname, 'images')));
 // app.use('api error')
module.exports = app;