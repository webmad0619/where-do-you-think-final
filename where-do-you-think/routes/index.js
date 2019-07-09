const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: './public/uploads/' });
const Movie = require("../models/Movie")
const User = require("../models/User")
const bcrypt = require("bcrypt");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/movie-creation', (req, res, next) => {
  res.render('movie-creation');
});

router.post('/movie-creation', upload.single('photo'), (req, res, next) => {
  Movie
    .create({
      name: req.body.name,
      year: +req.body.year,
      linkIMDB: req.body.linkIMDB,
      photoLocation: `/uploads/${req.file.filename}`,
      photoName: req.file.originalname,
      recordedInLocation: {
        type: "Point",
        coordinates: [0, 0]
      },
      city: req.body.city,
      country: req.body.country
    })
    .then(newMovieCreated => {
      res.redirect('/movies-list');
    })
});

router.get('/movies-list', (req, res, next) => {
  Movie
    .find()
    .sort({ name: -1 })
    .then(allMovies => {
      res.render('movies-list', { allMovies });
    })
});

router.get('/movie-edit/:id', (req, res, next) => {
  Movie
    .findById(req.params.id)
    .then(movieToBeEdited => {
      res.render('movie-edition', movieToBeEdited);
    })
});

router.post('/movie-edit', upload.single('photo'), (req, res, next) => {
  console.log(req.body)
  Movie
    .findByIdAndUpdate(req.body._id, req.body, { new: true })
    .then(editedMovie => {
      res.render('movie-edition', editedMovie);
    })
});

router.get('/profile', (req, res, next) => {
  console.log(req.user)
  User
    .findById(req.user._id)
    .then(user => {
      res.render('profile', user);
    })
});

router.post('/update-profile', (req, res, next) => {
  console.log("req.user._id")
  console.log(req.user._id)
  User
    .findById(req.user._id)
    .then(foundUser => {
      if (!bcrypt.compareSync(req.body["password-old"], foundUser.password)) {
        foundUser.errorMessage = 'Incorrect password'
        
        res.render("profile", foundUser);
        return;
      }

      const bcryptSalt = 10;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(req.body["password-new"], salt);

      User
        .findByIdAndUpdate(req.user._id, { password: hashPass })
        .then(updatedUser => {
          updatedUser.okMessage = "Password updated succesfully"
          res.render("profile", updatedUser)
        })
    })
});

module.exports = router;
