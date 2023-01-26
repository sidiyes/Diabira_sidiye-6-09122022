const express = require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const rateLimit = require('express-rate-limit');
const helmet = require("helmet");
const path = require('path');


const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


const app = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
})


 mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.HOST}${process.env.DATABASE}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());



app.use(limiter)

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(helmet());

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;

