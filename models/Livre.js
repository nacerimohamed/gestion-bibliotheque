const fs = require('fs').promises;
const path = require('path');

class Livre {
    constructor(numLivre, typeLivre, titre, nbrExemplaire) {
        this.numLivre = numLivre;
        this.typeLivre = typeLivre;
        this.titre = titre;
        this.nbrExemplaire = nbrExemplaire;
    }

    static async getAll() {
        const data = await this.readData();
        return data.livres;
    }

    static async getByNum(numLivre) {
        const data = await this.readData();
        return data.livres.find(livre => livre.numLivre === numLivre);
    }

    static async create(livreData) {
        const data = await this.readData();
        const newLivre = new Livre(
            livreData.numLivre,
            livreData.typeLivre,
            livreData.titre,
            livreData.nbrExemplaire
        );
        data.livres.push(newLivre);
        await this.writeData(data);
        return newLivre;
    }

    static async update(numLivre, updateData) {
        const data = await this.readData();
        const index = data.livres.findIndex(livre => livre.numLivre === numLivre);
        if (index === -1) return null;
        
        data.livres[index] = { ...data.livres[index], ...updateData };
        await this.writeData(data);
        return data.livres[index];
    }

    static async delete(numLivre) {
        const data = await this.readData();
        const initialLength = data.livres.length;
        data.livres = data.livres.filter(livre => livre.numLivre !== numLivre);
        await this.writeData(data);
        return initialLength !== data.livres.length;
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

module.exports = Livre;