const validationMiddleware = {
    // Validation pour l'emprunt
    validateEmprunt: (req, res, next) => {
        const { cin, numLiv } = req.body;
        const errors = [];

        if (!cin) errors.push('Le CIN est requis');
        if (!numLiv) errors.push('Le numéro du livre est requis');
        
        if (errors.length > 0) {
            return res.status(400).json({ 
                error: 'Données d\'emprunt invalides',
                details: errors 
            });
        }
        next();
    },

    // Validation pour l'abonné
    validateAbonne: (req, res, next) => {
        const { cin, nom, prenom, classe } = req.body;
        const errors = [];

        if (!cin) errors.push('Le CIN est requis');
        if (!nom) errors.push('Le nom est requis');
        if (!prenom) errors.push('Le prénom est requis');
        if (!classe) errors.push('La classe est requise');
        
        if (cin && !/^[A-Z0-9]{4,}$/i.test(cin)) {
            errors.push('Le CIN doit contenir au moins 4 caractères alphanumériques');
        }
        
        if (errors.length > 0) {
            return res.status(400).json({ 
                error: 'Données d\'abonné invalides',
                details: errors 
            });
        }
        next();
    },

    // Validation pour le livre
    validateLivre: (req, res, next) => {
        const { numLivre, typeLivre, titre, nbrExemplaire } = req.body;
        const errors = [];

        if (!numLivre) errors.push('Le numéro du livre est requis');
        if (!typeLivre) errors.push('Le type du livre est requis');
        if (!titre) errors.push('Le titre est requis');
        if (!nbrExemplaire) errors.push('Le nombre d\'exemplaires est requis');
        
        if (nbrExemplaire && (isNaN(nbrExemplaire) || nbrExemplaire < 0)) {
            errors.push('Le nombre d\'exemplaires doit être un nombre positif');
        }
        
        if (errors.length > 0) {
            return res.status(400).json({ 
                error: 'Données du livre invalides',
                details: errors 
            });
        }
        next();
    },

    // Validation pour les paramètres
    validateParams: (req, res, next) => {
        const { id, cin, code, numero } = req.params;
        
        // Vérifier que les paramètres nécessaires sont présents
        if (id && isNaN(id)) {
            return res.status(400).json({ error: 'L\'ID doit être un nombre' });
        }
        
        if (cin && cin.length < 3) {
            return res.status(400).json({ error: 'Le CIN est invalide' });
        }
        
        next();
    }
};

module.exports = validationMiddleware;