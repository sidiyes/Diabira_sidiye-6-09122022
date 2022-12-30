const express = require("express");
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

const app = express();


 mongoose.connect('mongodb+srv://usernamep6:passwordp6@cluster0.gwplgkp.mongodb.net/hotakes?retryWrites=true&w=majority',
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

app.use('/api/auth', userRoutes);

// app.use((req, res, next) => {
//   res.json({ message: "test" });
//   next();
// });

module.exports = app;
