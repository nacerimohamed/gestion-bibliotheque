# 📚 API de Gestion de Bibliothèque

## Description

Une API RESTful développée avec Node.js et Express pour la gestion des emprunts de livres dans un institut. L'application suit l'architecture MVC (Modèle-Vue-Contrôleur) et permet de gérer les abonnés, les livres et les emprunts.

## ✨ Fonctionnalités

### Gestion des Abonnés
- ✅ Ajouter un nouvel abonné
- ✅ Lister tous les abonnés
- ✅ Afficher les détails d'un abonné
- ✅ Modifier les informations d'un abonné
- ✅ Supprimer un abonné
- ✅ Voir les emprunts d'un abonné

### Gestion des Livres
- ✅ Ajouter un nouveau livre
- ✅ Lister tous les livres
- ✅ Afficher les détails d'un livre
- ✅ Modifier les informations d'un livre
- ✅ Supprimer un livre
- ✅ Voir les emprunts d'un livre

### Gestion des Emprunts
- ✅ Effectuer un emprunt (avec vérification de disponibilité)
- ✅ Lister tous les emprunts (classés par date)
- ✅ Afficher les détails d'un emprunt (avec infos abonné et livre)
- ✅ Modifier un emprunt
- ✅ Supprimer un emprunt
- ✅ Voir les emprunts d'un abonné spécifique
- ✅ Voir les emprunts d'un livre spécifique

### Statistiques
- 📊 Nombre total d'abonnés, livres et emprunts
- 📊 Classement des livres les plus empruntés
- 📊 Répartition des abonnés par classe
- 📊 Répartition des livres par type

## 🛠 Technologies Utilisées

- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web pour Node.js
- **File System (fs)** - Stockage des données en JSON
- **CORS** - Gestion des autorisations cross-origin
- **dotenv** - Gestion des variables d'environnement

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version 14.x ou supérieure)
- [npm](https://www.npmjs.com/) (version 6.x ou supérieure)
- Un navigateur web ou [Postman](https://www.postman.com/) pour tester les API

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-utilisateur/gestion-bibliotheque.git
cd gestion-bibliotheque
