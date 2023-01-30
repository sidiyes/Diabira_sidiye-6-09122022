const Sauce = require("../models/sauce");

const fs = require("fs");

const jwt = require("jsonwebtoken");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);

  
  if (req.file) {
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });

    sauce
      .save()
      .then(() => res.status(201).json({ message: "Objet enregistré" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    return res.status(400).json({ message: "image" });
  }
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        if (req.file) {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {});
        }

        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        //Séparation du nom du fichier grâce au "/images/"" contenu dans l'url
        const filename = sauce.imageUrl.split("/images/")[1];
        //Utilisation de la fonction unlink pour supprimer l'image et suppression de toute la Sauce
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.like = (req, res, next) => {
  const like = req.body.like;

  if (like === 1) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (
          sauce.usersDisliked.includes(req.body.userId) ||
          sauce.usersLiked.includes(req.body.userId)
        ) {
          res.status(401).json({ message: "Not authorized" });
        } else {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $push: { usersLiked: req.body.userId },
              $inc: { likes: +1 },
            }
          )
            .then(() => res.status(200).json({ message: "J'aime !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(404).json({ error }));
  }
  if (like === -1) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (
          sauce.usersDisliked.includes(req.body.userId) ||
          sauce.usersLiked.includes(req.body.userId)
        ) {
          res.status(401).json({ message: "Not authorized" });
        } else {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $push: { usersDisliked: req.body.userId },
              $inc: { dislikes: +1 },
            }
          )
            .then(() => res.status(200).json({ message: "Je n'aime pas !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(404).json({ error }));
  }

  if (like === 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersLiked: req.body.userId },
              $inc: { likes: -1 },
            }
          )
            .then(() => res.status(200).json({ message: "j'aime retiré !" }))
            .catch((error) => res.status(400).json({ error }));
        }
        if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then(() =>
              res.status(200).json({ message: "Je n'aime pas retiré !" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(404).json({ error }));
  }
};
