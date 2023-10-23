const jwt = require('jsonwebtoken');
const User = require('../models/User')
const bcrypt = require('bcrypt');
const { contains, includes } = require('underscore');
require('dotenv').config();
const validator = require('email-validator')

// faire des verification des mails reg ex a check
exports.signup = (req, res, next) => {

  if (validator.validate(req.body.email)) {
    const RegExTest = /^(?=.*[¨^£$¤!§:;.?,<>&~"#'\{\(\[\]\)\}\]\\\/\|\\`_°\+\=%-])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g
    //const RegExTest = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*?[#?!@$%^&*-£€~§]).{8,}$/g //und es element de la lise
    const theTest = RegExTest.test(req.body.password)
    console.log(RegExTest.test(req.body.password))
    console.log(theTest)
    if (theTest){
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
      return res.status(403).json({ error: 'Mot de passe incorrect, necessite au moins 8 charactères, une majuscule, une minuscule, un chiffre, et un charactère spécial' })
    }
  } else {
    return res.status(403).json({ error: `L'identifiant doit être un email valide` })
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