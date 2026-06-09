const fs = require('fs').promises;
const path = require('path');

class Emprunt {
    constructor(numEmprunt, cin, numLiv, date) {
        this.numEmprunt = numEmprunt;
        this.cin = cin;
        this.numLiv = numLiv;
        this.date = date || new Date();
    }

    static async getAll() {
        const data = await this.readData();
        return data.emprunts;
    }

    static async getByNum(numEmprunt) {
        const data = await this.readData();
        return data.emprunts.find(emprunt => emprunt.numEmprunt == numEmprunt);
    }

    static async getAllSortedByDate() {
        const data = await this.readData();
        return data.emprunts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    static async create(empruntData) {
        const data = await this.readData();
        
        // Vérifier si l'abonné existe
        const abonne = data.abonnes.find(a => a.cin === empruntData.cin);
        if (!abonne) {
            throw new Error('Abonné non trouvé');
        }
        
        // Vérifier si le livre existe et a des exemplaires disponibles
        const livre = data.livres.find(l => l.numLivre === empruntData.numLiv);
        if (!livre) {
            throw new Error('Livre non trouvé');
        }
        
        // Compter les emprunts actifs de ce livre
        const empruntsActifs = data.emprunts.filter(e => e.numLiv === empruntData.numLiv).length;
        if (empruntsActifs >= livre.nbrExemplaire) {
            throw new Error('Aucun exemplaire disponible');
        }
        
        const newEmprunt = new Emprunt(
            Date.now(),
            empruntData.cin,
            empruntData.numLiv,
            new Date()
        );
        
        data.emprunts.push(newEmprunt);
        await this.writeData(data);
        return newEmprunt;
    }

    static async update(numEmprunt, updateData) {
        const data = await this.readData();
        const index = data.emprunts.findIndex(emprunt => emprunt.numEmprunt == numEmprunt);
        if (index === -1) return null;
        
        data.emprunts[index] = { ...data.emprunts[index], ...updateData };
        await this.writeData(data);
        return data.emprunts[index];
    }

    static async delete(numEmprunt) {
        const data = await this.readData();
        const initialLength = data.emprunts.length;
        data.emprunts = data.emprunts.filter(emprunt => emprunt.numEmprunt != numEmprunt);
        await this.writeData(data);
        return initialLength !== data.emprunts.length;
    }

    static async getEmpruntsByLivre(numLivre) {
        const data = await this.readData();
        const emprunts = data.emprunts.filter(emprunt => emprunt.numLiv === numLivre);
        
        // Enrichir avec les détails des abonnés
        const empruntsEnriched = emprunts.map(emprunt => {
            const abonne = data.abonnes.find(a => a.cin === emprunt.cin);
            return { ...emprunt, abonne };
        });
        
        return empruntsEnriched;
    }

    static async getEmpruntsByAbonne(cin) {
        const data = await this.readData();
        const emprunts = data.emprunts.filter(emprunt => emprunt.cin === cin);
        
        // Enrichir avec les détails des livres
        const empruntsEnriched = emprunts.map(emprunt => {
            const livre = data.livres.find(l => l.numLivre === emprunt.numLiv);
            return { ...emprunt, livre };
        });
        
        return empruntsEnriched;
    }

    static async getEmpruntDetails(numEmprunt) {
        const data = await this.readData();
        const emprunt = data.emprunts.find(e => e.numEmprunt == numEmprunt);
        if (!emprunt) return null;
        
        const abonne = data.abonnes.find(a => a.cin === emprunt.cin);
        const livre = data.livres.find(l => l.numLivre === emprunt.numLiv);
        
        return {
            emprunt,
            abonne,
            livre
        };
    }

    static async readData() {
        const dbPath = path.join(__dirname, '../database/db.json');
        const data = await fs.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    }

    static async writeData(data) {
        const dbPath = path.join(__dirname, '../database/db.json');
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
    }
}

module.exports = Emprunt;