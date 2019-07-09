const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: './public/uploads/' });
const Movie = require("../models/Movie")

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/movie-creation', (req, res, next) => {
  res.render('movieCreation');
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
    .sort({name: -1})
    .then(allMovies => {
      res.render('movies-list', {allMovies});
    })
});

router.get('/movie-edit/:id', (req, res, next) => {
  Movie
    .findById(req.params.id)
    .then(movieToBeEdited => {
      res.render('movieEdition', movieToBeEdited);
    })
});

router.post('/movie-edit', upload.single('photo'), (req, res, next) => {
  console.log(req.body)
  Movie
    .findByIdAndUpdate(req.body._id, req.body, {new: true})
    .then(editedMovie => {
      res.render('movieEdition', editedMovie);
    })
});

module.exports = router;
