const express = require('express');
const router = express.Router();
const abonneController = require('../controllers/abonneController');
const empruntController = require('../controllers/empruntController');

// GET /abonnes - Lister tous les abonnés
router.get('/', abonneController.getAllAbonnes);

// GET /abonnes/:cin - Afficher les détails d'un abonné
router.get('/:cin', abonneController.getAbonneById);

// POST /abonnes - Ajouter un abonné
router.post('/', abonneController.createAbonne);

// PUT /abonnes/:cin - Mettre à jour un abonné
router.put('/:cin', abonneController.updateAbonne);

// DELETE /abonnes/:cin - Supprimer un abonné
router.delete('/:cin', abonneController.deleteAbonne);

// PUT /abonnes/:cin/emprunts - Mettre à jour les emprunts d'un abonné
router.put('/:cin/emprunts', empruntController.updateAbonneEmprunts);

module.exports = router;