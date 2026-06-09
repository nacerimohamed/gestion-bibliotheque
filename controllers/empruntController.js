const Emprunt = require('../models/Emprunt');
const Livre = require('../models/Livre');

const empruntController = {
    // Lister tous les emprunts classés par date
    async getAllEmprunts(req, res) {
        try {
            const emprunts = await Emprunt.getAllSortedByDate();
            res.status(200).json(emprunts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Récupérer les détails d'un emprunt spécifique
    async getEmpruntById(req, res) {
        try {
            const { numero } = req.params;
            const empruntDetails = await Emprunt.getEmpruntDetails(numero);
            
            if (!empruntDetails) {
                return res.status(404).json({ error: 'Emprunt non trouvé' });
            }
            
            res.status(200).json(empruntDetails);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Effectuer un nouvel emprunt
    async createEmprunt(req, res) {
        try {
            const { cin, numLiv } = req.body;
            
            if (!cin || !numLiv) {
                return res.status(400).json({ error: 'CIN et numLivre sont requis' });
            }
            
            const newEmprunt = await Emprunt.create({ cin, numLiv });
            res.status(201).json(newEmprunt);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Mettre à jour un emprunt
    async updateEmprunt(req, res) {
        try {
            const { numero } = req.params;
            const updateData = req.body;
            
            const updatedEmprunt = await Emprunt.update(numero, updateData);
            
            if (!updatedEmprunt) {
                return res.status(404).json({ error: 'Emprunt non trouvé' });
            }
            
            res.status(200).json(updatedEmprunt);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Supprimer un emprunt
    async deleteEmprunt(req, res) {
        try {
            const { numero } = req.params;
            const deleted = await Emprunt.delete(numero);
            
            if (!deleted) {
                return res.status(404).json({ error: 'Emprunt non trouvé' });
            }
            
            res.status(200).json({ message: 'Emprunt supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Récupérer les emprunts d'un livre spécifique
    async getEmpruntsByLivre(req, res) {
        try {
            const { code } = req.params;
            const emprunts = await Emprunt.getEmpruntsByLivre(code);
            res.status(200).json(emprunts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Mettre à jour les emprunts d'un abonné (exemple: retourner tous les livres)
    async updateAbonneEmprunts(req, res) {
        try {
            const { cin } = req.params;
            const { action } = req.body;
            
            if (action === 'returnAll') {
                const emprunts = await Emprunt.getEmpruntsByAbonne(cin);
                for (const emprunt of emprunts) {
                    await Emprunt.delete(emprunt.numEmprunt);
                }
                res.status(200).json({ message: 'Tous les livres ont été retournés' });
            } else {
                res.status(400).json({ error: 'Action non supportée' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = empruntController;