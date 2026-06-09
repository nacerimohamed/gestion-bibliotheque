const fs = require('fs').promises;
const path = require('path');

class Abonne {
    constructor(cin, nom, prenom, classe) {
        this.cin = cin;
        this.nom = nom;
        this.prenom = prenom;
        this.classe = classe;
    }

    static async getAll() {
        const data = await this.readData();
        return data.abonnes;
    }

    static async getByCin(cin) {
        const data = await this.readData();
        return data.abonnes.find(abonne => abonne.cin === cin);
    }

    static async create(abonneData) {
        const data = await this.readData();
        const newAbonne = new Abonne(
            abonneData.cin,
            abonneData.nom,
            abonneData.prenom,
            abonneData.classe
        );
        data.abonnes.push(newAbonne);
        await this.writeData(data);
        return newAbonne;
    }

    static async update(cin, updateData) {
        const data = await this.readData();
        const index = data.abonnes.findIndex(abonne => abonne.cin === cin);
        if (index === -1) return null;
        
        data.abonnes[index] = { ...data.abonnes[index], ...updateData };
        await this.writeData(data);
        return data.abonnes[index];
    }

    static async delete(cin) {
        const data = await this.readData();
        const initialLength = data.abonnes.length;
        data.abonnes = data.abonnes.filter(abonne => abonne.cin !== cin);
        await this.writeData(data);
        return initialLength !== data.abonnes.length;
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

module.exports = Abonne;