const Livre = require('../models/Livre');

const livreController = {
    // Lister tous les livres
    async getAllLivres(req, res) {
        try {
            const livres = await Livre.getAll();
            res.status(200).json(livres);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Afficher les détails d'un livre spécifique
    async getLivreById(req, res) {
        try {
            const { code } = req.params;
            const livre = await Livre.getByNum(code);
            
            if (!livre) {
                return res.status(404).json({ error: 'Livre non trouvé' });
            }
            
            res.status(200).json(livre);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Ajouter un nouveau livre
    async createLivre(req, res) {
        try {
            const { numLivre, typeLivre, titre, nbrExemplaire } = req.body;
            
            if (!numLivre || !typeLivre || !titre || !nbrExemplaire) {
                return res.status(400).json({ error: 'Tous les champs sont requis' });
            }
            
            // Vérifier si le livre existe déjà
            const existingLivre = await Livre.getByNum(numLivre);
            if (existingLivre) {
                return res.status(400).json({ error: 'Un livre avec ce numéro existe déjà' });
            }
            
            const newLivre = await Livre.create({ numLivre, typeLivre, titre, nbrExemplaire });
            res.status(201).json(newLivre);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Mettre à jour un livre
    async updateLivre(req, res) {
        try {
            const { code } = req.params;
            const updateData = req.body;
            
            const updatedLivre = await Livre.update(code, updateData);
            
            if (!updatedLivre) {
                return res.status(404).json({ error: 'Livre non trouvé' });
            }
            
            res.status(200).json(updatedLivre);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Supprimer un livre
    async deleteLivre(req, res) {
        try {
            const { code } = req.params;
            const deleted = await Livre.delete(code);
            
            if (!deleted) {
                return res.status(404).json({ error: 'Livre non trouvé' });
            }
            
            res.status(200).json({ message: 'Livre supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = livreController;