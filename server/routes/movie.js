/*
    The server's methods implementation page
*/
const fs = require('fs');

// variables
const dataPath = './server/data/movie.json';

// helper methods
const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (!data) data = "{}";
        callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
            console.log(err);
        }
        callback();
    });
};

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~   */

module.exports = {

    /* GET: */

    //returns the movies list sorted by dates down
    getMovies: function (req, res) {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.sendStatus(500);
            } else {
                let arr = [];
                for (var mov in JSON.parse(data))
                    arr.push([mov, (JSON.parse(data))[mov]]);
                arr.sort(function (a, b) {
                    let d1 = a[1].date.split('-').reverse().join();
                    let d2 = b[1].date.split('-').reverse().join();
                    return d1 < d2 ? 1 : (d1 > d2 ? -1 : 0);
                })
                res.send(arr);
            }
        });
    },

    //receives a movie's id and returns the movies details
    getMovie: function (req, res) {
        readFile(data => {
            const movieId = req.params["id"]; // get the movie
            var dataS = JSON.parse(data);
            if (dataS[movieId]) {
                res.send(dataS[movieId]);
            } else res.sendStatus(400);
        });
    },
    /* ~~~~~~~~~~~~~~~~~~~~~   */

    /* CREATE */

    // add the new movie
    createMovie: function (req, res) {
        readFile(data => {
            //validates the request:
            if (!req.body.id || !req.body.name || !req.body.picture || req.body.isSeries == undefined || !req.body.director || !req.body.date || !req.body.rating)
                return res.sendStatus(500); //server's error
            if ((req.body.isSeries && !req.body.series_details) || (!req.body.isSeries && req.body.series_details))
                return res.sendStatus(500); //server's error
            data[req.body.id] = req.body;
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`The movie ${req.body.name} added`);
            });
        },
            true);
    },
    /* ~~~~~~~~~~~~~~~~~~~~~   */

    /* UPDATE */

    //recives the details to update on the requeset's body and the movie's id as a parameter,
    //and updates that movie by the details
    updateMovie: function (req, res) {
        readFile(data => {
            const movieId = req.params["id"];
            const movieDetails = req.body;
            //the movie doesnt exists
            if (!data[movieId])
                res.sendStatus(400); //user's error 
            else {
                if (movieDetails.name)
                    data[movieId].name = movieDetails.name;
                if (movieDetails.picture)
                    data[movieId].picture = movieDetails.picture;
                if (movieDetails.director)
                    data[movieId].director = movieDetails.director;
                if (movieDetails.isSeries != undefined)
                    data[movieId].isSeries = movieDetails.isSeries;
                if (movieDetails.date)
                    data[movieId].date = movieDetails.date;
                if (movieDetails.rating)
                    data[movieId].rating = movieDetails.rating;
                if (data[movieId].isSeries) {
                    if (movieDetails.series_details)
                        data[movieId].series_details = movieDetails.series_details;
                } else if (data[movieId].series_details)
                    delete data[movieId].series_details;
            }
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`The movie ${data[movieId].name} updated`);
            });
        },
            true);
    },

    //recieves a new actors details and the movie's id and adds the actoe to the movie
    AddActorToMovie: function (req, res) {
        readFile(data => {
            const movieId = req.params["id"];
            const actorDetails = req.body;
            //validates the request:
            if (!data[movieId].actors) data[movieId].actors = {};
            if (!data[movieId] || !actorDetails || data[movieId].actors[actorDetails.name])
                return res.sendStatus(500); //server's error

            data[movieId].actors = Object.assign(data[movieId].actors, {
                [actorDetails.name]: actorDetails
            });

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`${actorDetails.name} added to ${data[movieId].name}`);
            });
        },
            true);
    },
    /* ~~~~~~~~~~~~~~~~~~~~~   */

    /* DELETE */

    //receives an actors name and a movie's id as parameters, and delete that actor
    deleteActorFromMovie: function (req, res) {
        readFile(data => {

            const movieId = req.params["id"];
            const actorName = req.params["name"];
            //the actor or the movie are't valid
            if (!data[movieId] || !data[movieId].actors || !data[movieId].actors[actorName])
                res.sendStatus(400); //user's error
            else {
                delete data[movieId].actors[actorName];
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send(`The actor ${actorName} removed from ${movieId} `);
                });
            }
        },
            true);
    },

    //recieves a movie's id and deletes it
    deleteMovie: function (req, res) {
        readFile(data => {
            const movieId = req.params["id"];
            //movie does not exist 
            if (!data[movieId])
                res.sendStatus(400); //user's error
            else {
                delete data[movieId];
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send(`The movie with the id: ${movieId} removed`);
                });
            }
        },
            true);
    }
};