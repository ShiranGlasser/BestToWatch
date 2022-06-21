/*
   The server's routs defining file
*/
const express = require('express'),
    movieRoutes = require('./movie');

var router = express.Router();

/*  server's methods   */
router.get('/movies', movieRoutes.getMovies);
router.get('/movie/:id', movieRoutes.getMovie);
router.post('/movie', movieRoutes.createMovie);
router.put('/movie/:id', movieRoutes.updateMovie);
router.put('/actor/:id', movieRoutes.AddActorToMovie);
router.delete('/actor/:id/:name', movieRoutes.deleteActorFromMovie);
router.delete('/movie/:id', movieRoutes.deleteMovie);


module.exports = router;