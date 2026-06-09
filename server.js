const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

// Import des routes
const empruntRoutes = require('./routes/empruntRoutes');
const abonneRoutes = require('./routes/abonneRoutes');
const livreRoutes = require('./routes/livreRoutes');

const app = express();
const DEFAULT_PORT = 3000;
const MAX_PORT_ATTEMPTS = 10;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour logger les requêtes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/emprunts', empruntRoutes);
app.use('/api/abonnes', abonneRoutes);
app.use('/api/livres', livreRoutes);

// Route racine
app.get('/', (req, res) => {
    res.json({
        message: 'API de gestion de bibliothèque',
        version: '1.0.0',
        endpoints: {
            emprunts: '/api/emprunts',
            abonnes: '/api/abonnes',
            livres: '/api/livres'
        }
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Initialisation de la base de données
async function initDatabase() {
    const dbPath = path.join(__dirname, 'database', 'db.json');
    const dbDir = path.join(__dirname, 'database');
    
    try {
        await fs.access(dbDir);
    } catch {
        await fs.mkdir(dbDir, { recursive: true });
    }
    
    try {
        await fs.access(dbPath);
    } catch {
        const initialData = {
            livres: [
                { numLivre: "LIV001", typeLivre: "Roman", titre: "Le Petit Prince", nbrExemplaire: 5 },
                { numLivre: "LIV002", typeLivre: "Science", titre: "Cosmos", nbrExemplaire: 3 },
                { numLivre: "LIV003", typeLivre: "Histoire", titre: "Sapiens", nbrExemplaire: 2 }
            ],
            abonnes: [
                { cin: "AB123", nom: "Martin", prenom: "Sophie", classe: "2ème année" },
                { cin: "AB456", nom: "Bernard", prenom: "Thomas", classe: "1ère année" }
            ],
            emprunts: []
        };
        await fs.writeFile(dbPath, JSON.stringify(initialData, null, 2));
        console.log('Base de données initialisée avec succès');
    }
}

// Fonction pour trouver un port disponible
async function findAvailablePort(startPort, maxAttempts) {
    const net = require('net');
    
    for (let i = 0; i < maxAttempts; i++) {
        const port = startPort + i;
        const isAvailable = await new Promise((resolve) => {
            const server = net.createServer();
            server.once('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    resolve(false);
                } else {
                    resolve(false);
                }
            });
            server.once('listening', () => {
                server.close();
                resolve(true);
            });
            server.listen(port);
        });
        
        if (isAvailable) {
            return port;
        }
    }
    return null;
}

// Démarrage du serveur avec gestion des conflits
async function startServer() {
    await initDatabase();
    
    const requestedPort = process.env.PORT || DEFAULT_PORT;
    const availablePort = await findAvailablePort(requestedPort, MAX_PORT_ATTEMPTS);
    
    if (!availablePort) {
        console.error(`\x1b[31m%s\x1b[0m`, `❌ Erreur: Aucun port disponible entre ${requestedPort} et ${requestedPort + MAX_PORT_ATTEMPTS - 1}`);
        console.log('\n💡 Solutions possibles:');
        console.log('   1. Arrêtez le processus qui utilise le port: netstat -ano | findstr :3000');
        console.log('   2. Changez le port dans le fichier .env: PORT=3002');
        console.log('   3. Utilisez la commande: set PORT=3002 && npm start');
        process.exit(1);
    }
    
    app.listen(availablePort, () => {
        console.log('\x1b[32m%s\x1b[0m', `✅ Serveur démarré avec succès!`);
        console.log(`📚 API de gestion de bibliothèque`);
        console.log(`🌐 Adresse: http://localhost:${availablePort}`);
        console.log(`📖 Documentation: http://localhost:${availablePort}/`);
        console.log('\n📋 Endpoints disponibles:');
        console.log(`   GET    /api/emprunts`);
        console.log(`   GET    /api/emprunts/:numero`);
        console.log(`   POST   /api/emprunts`);
        console.log(`   PUT    /api/emprunts/:numero`);
        console.log(`   DELETE /api/emprunts/:numero`);
        console.log(`   GET    /api/abonnes`);
        console.log(`   POST   /api/abonnes`);
        console.log(`   GET    /api/abonnes/:cin`);
        console.log(`   DELETE /api/abonnes/:cin`);
        console.log(`   GET    /api/livres`);
        console.log(`   GET    /api/livres/:code/emprunts`);
        console.log(`   PUT    /api/abonnes/:cin/emprunts`);
    });
}

startServer();

module.exports = app;