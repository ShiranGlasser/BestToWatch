/*
    Shiran Glasser and Roni Fahndrich
   The server's declaration page
   defines the servers methods and the server's and user's routs 
*/

const express = require('express'),
    path = require('path'),
    fs = require('fs'),
    compression = require('compression'),
    cors = require('cors');
routers = require('./server/routes/routes.js');
const port = 3001;

const app = express();

/* used for the restfull: */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routers);   //defines the servers routs as in the file. 

/* defines the user's routs: */
app.use('/list', express.static(path.join(__dirname, 'client/html/index.html')));
app.use('/editMovie', express.static(path.join(__dirname, 'client/html/editMovie.html')));
app.use('/addMovie', express.static(path.join(__dirname, 'client/html/addNewMovie.html')));
app.use('/js', express.static(path.join(__dirname, 'client/js')));
app.use('/css', express.static(path.join(__dirname, 'client/css')));

const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});