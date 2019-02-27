require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIES = require('./movie-data.json');

const app = express();

app.use(helmet());
app.use(cors());

const morganSettings = process.env.NODE_ENV === 'production' ? 'tiny' : 'dev';
app.use(morgan('dev'));

app.use(validateKey);

function validateKey(req, res, next) {
    const authToken = req.get('Authorization');
    const inStoreAPI = process.env.API_TOKEN;
    if (!authToken || authToken.split(' ')[1] !== inStoreAPI) {
        return res.status(401).json({error: 'Unauthorized'});
    }
    next();
}

function handleGetMovie(req, res) {
    const {title, genres, country, avg_vote} = req.query;

    let results = MOVIES.movies

    if (title) {
        results = results.filter(movie => {
            return movie.film_title.toLowerCase().includes(title.toLowerCase())
        })
    }
    if (genres) {
        results = results.filter(movie => {
            return movie.genre.toLowerCase().includes(genres.toLowerCase())
        })
    }
    if (country) {
        results = results.filter(movie => {
            return movie.country.toLowerCase() === country.toLowerCase()
        })
    }
    if (avg_vote) {
        results = results.filter(movie => {
            return Number(movie.avg_vote) >= Number(avg_vote)
        })
    }

    res.json(results)
}

app.get('/movie', handleGetMovie)

app.use((error, req, res) => {
    let response;
    if(process.env.NODE_ENV === 'production') {
        response = { error: {message: 'server error'}}
    }
    else {
        response = {error}
    }
    res.status(500).json(response);
})

module.exports = app;