const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const BookRoutes = require('./routes/Book')
const userRoutes = require('./routes/User');
const path = require('path');
/*
const NodeRateLimiter = require('node-rate-limiter');
const nodeRateLimiter = new NodeRateLimiter();
*/
const result = require('dotenv').config;
console.error(result.error)

const app = express();
// catch les erreurs d'end point
console.log(`mongodb+srv://${process.env.MONGO_IDENTIFICATION}:${process.env.MONGO_KEY}@${process.env.MONGO_CLUSTER}`, result.error)
mongoose.connect(`mongodb+srv://${process.env.MONGO_IDENTIFICATION}:${process.env.MONGO_KEY}@${process.env.MONGO_CLUSTER}`,
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
  app.use('/api/auth',/* RequestRateLimitMiddleware, */userRoutes);

  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('*',(req,res)=>{ return res.status(404).json({error: error})})

/*
 function RequestRateLimitMiddleware(req, res, next) {
  nodeRateLimiter.get(res.yourUniqIdForCurrentSession, (err, limit) => {
    if (err) {
      return next(err);
    }
 
    res.set('X-RateLimit-Limit', limit.total);
    res.set('X-RateLimit-Remaining', limit.remaining);
    res.set('X-RateLimit-Reset', limit.reset);
 
    if (limit.remaining) {
      return next();
    }
 
    res.set('Retry-After', limit.reset);
    res.send(429, `Rate limit exceeded, retry in ${limit.reset} ms`);
  });
}*/
module.exports = app;