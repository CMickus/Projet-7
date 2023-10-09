const jwt = require('jsonwebtoken');
const User = require('../models/User')
const bcrypt = require('bcrypt')
require('dotenv').config
import {
  validator,
  minLength,
  containsOneOfCharsCount,
  CHARSET_LOWER_ALPHA,
  CHARSET_NUMBER,
  CHARSET_UPPER_ALPHA,
  isEmpty,
} from "string-validators";
const emailValidator = require('email-validator')

// faire des verification des mails reg ex a check
exports.signup = (req, res, next) => {

  if (req.body.email) {
    if (validator(req.body.password, [
      not(isEmpty),
      minLength(8),
      containsOneOfCharsMinCount(CHARSET_LOWER_ALPHA, 1),
      containsOneOfCharsMinCount(CHARSET_UPPER_ALPHA, 1),
      containsOneOfCharsMinCount(CHARSET_NUMBER, 1),
      containsOneOfCharsMinCount('$#%+*-=[]/(){}€£!?_\^°~<>.,;|', 1),
    ])) {
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
              `${process.env.SECRET_KEY}`,//a mettre dans un env
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};