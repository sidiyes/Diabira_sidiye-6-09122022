 const mongoose = require('mongoose');
 const uniqueValidator = require('mongoose-unique-validator');

 const userSchema = mongoose.Schema({
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
 });

 //Plugin qui empêche deux utilisateurs d'avoir la même adresse email
 userSchema.plugin(uniqueValidator);

 module.exports = mongoose.model('User', userSchema); 
