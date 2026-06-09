const express = require('express');
const router = express.Router();
const livreController = require('../controllers/livreController');
const empruntController = require('../controllers/empruntController');

// GET /livres - Lister tous les livres
router.get('/', livreController.getAllLivres);

// GET /livres/:code - Afficher les détails d'un livre
router.get('/:code', livreController.getLivreById);

// POST /livres - Ajouter un livre
router.post('/', livreController.createLivre);

// PUT /livres/:code - Mettre à jour un livre
router.put('/:code', livreController.updateLivre);

// DELETE /livres/:code - Supprimer un livre
router.delete('/:code', livreController.deleteLivre);

// GET /livres/:code/emprunts - Lister les emprunts d'un livre
router.get('/:code/emprunts', empruntController.getEmpruntsByLivre);

module.exports = router;