const Abonne = require('../models/Abonne');
const Emprunt = require('../models/Emprunt');

const abonneController = {
    // Lister tous les abonnés
    async getAllAbonnes(req, res) {
        try {
            const abonnes = await Abonne.getAll();
            res.status(200).json(abonnes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Afficher les détails d'un abonné spécifique
    async getAbonneById(req, res) {
        try {
            const { cin } = req.params;
            const abonne = await Abonne.getByCin(cin);
            
            if (!abonne) {
                return res.status(404).json({ error: 'Abonné non trouvé' });
            }
            
            // Récupérer les emprunts de l'abonné
            const emprunts = await Emprunt.getEmpruntsByAbonne(cin);
            
            res.status(200).json({ ...abonne, emprunts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Ajouter un nouvel abonné
    async createAbonne(req, res) {
        try {
            const { cin, nom, prenom, classe } = req.body;
            
            if (!cin || !nom || !prenom || !classe) {
                return res.status(400).json({ error: 'Tous les champs sont requis' });
            }
            
            // Vérifier si l'abonné existe déjà
            const existingAbonne = await Abonne.getByCin(cin);
            if (existingAbonne) {
                return res.status(400).json({ error: 'Un abonné avec ce CIN existe déjà' });
            }
            
            const newAbonne = await Abonne.create({ cin, nom, prenom, classe });
            res.status(201).json(newAbonne);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Mettre à jour un abonné
    async updateAbonne(req, res) {
        try {
            const { cin } = req.params;
            const updateData = req.body;
            
            const updatedAbonne = await Abonne.update(cin, updateData);
            
            if (!updatedAbonne) {
                return res.status(404).json({ error: 'Abonné non trouvé' });
            }
            
            res.status(200).json(updatedAbonne);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Supprimer un abonné
    async deleteAbonne(req, res) {
        try {
            const { cin } = req.params;
            
            // Vérifier si l'abonné a des emprunts en cours
            const emprunts = await Emprunt.getEmpruntsByAbonne(cin);
            if (emprunts.length > 0) {
                return res.status(400).json({ error: 'Cet abonné a des emprunts en cours' });
            }
            
            const deleted = await Abonne.delete(cin);
            
            if (!deleted) {
                return res.status(404).json({ error: 'Abonné non trouvé' });
            }
            
            res.status(200).json({ message: 'Abonné supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = abonneController;