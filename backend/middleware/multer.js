const multer = require('multer');
//LES FORMATS D'IMAGES
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//RENOMME ET ENREGISTRE L'IMAGE DANS LE DOSSIER "IMAGES"
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');