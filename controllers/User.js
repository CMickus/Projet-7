const jwt = require('jsonwebtoken');
const User = require('../models/User')
const bcrypt = require('bcrypt')
require('dotenv').config

//const  validator = require('string-validators');
/*const minLength = require('string-validators');
const containsOneOfCharsCount = require('string-validators');
const CHARSET_LOWER_ALPHA = require('string-validators');
const CHARSET_NUMBER = require('string-validators');
const CHARSET_UPPER_ALPHA = require('string-validators');
const isEmpty = require('string-validators');*/

//const emailValidator = require('email-validator')

// faire des verification des mails reg ex a check
exports.signup = (req, res, next) => {

  if (validator.validate(req.body.email) && validator(req.body.password,[not(isEmpty)])) {
    if (validator(req.body.password, /*[
      ot(isEmpty),
      minLength(8),
      containsOneOfCharsMinCount(CHARSET_LOWER_ALPHA, 1),
      containsOneOfCharsMinCount(CHARSET_UPPER_ALPHA, 1),
      containsOneOfCharsMinCount(CHARSET_NUMBER, 1),
      containsOneOfCharsMinCount('$#%+*-=[]/(){}€£!?_\^°~<>.,;|', 1),
    ]*/)) {
      bcrypt.hash(req.body.password, 10)
        .then(hash => {
          const user = new User({
            email: req.body.email,
            password: hash
          });
          user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    } else {
        return res.status(403).json({error: 'Mot de passe incorrect, necessite au moins 8 charactères, une majuscule, une minuscule, un chiffre, et un charactère spécial'})
    }
  } else{
    return res.status(403).json({error: `L'identifiant doit être un email valide` })
  }
};

//ajout d'un packecage pour ocmpter les tentatives de co
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur ou mot de passe incorrect !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Utilisateur ou mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              `${process.env.SECRET_KEY}`,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};