const express = require('express');
const router = express.Router();
const empruntController = require('../controllers/empruntController');

// GET /emprunts - Lister tous les emprunts classés par date
router.get('/', empruntController.getAllEmprunts);

// GET /emprunts/:numero - Récupérer les détails d'un emprunt spécifique
router.get('/:numero', empruntController.getEmpruntById);

// POST /emprunts - Effectuer un nouvel emprunt
router.post('/', empruntController.createEmprunt);

// PUT /emprunts/:numero - Mettre à jour un emprunt
router.put('/:numero', empruntController.updateEmprunt);

// DELETE /emprunts/:numero - Supprimer un emprunt
router.delete('/:numero', empruntController.deleteEmprunt);

module.exports = router;