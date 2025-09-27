const Departement = require("../models/Departement");
// N'oubliez pas d'importer le modèle User si vous voulez manipuler chefDepartementId
// const User = require("../models/User"); 
const mongoose = require("mongoose");

// --- 1. Créer un Nouveau Département (ADMIN SEULEMENT) ---
exports.createDepartement = async (req, res) => {
    const { nom, code, description, chefDepartementId } = req.body;

    // Vérification basique des champs
    if (!nom || !code) {
        return res.status(400).json({ message: "Le nom et le code du département sont requis." });
    }

    try {
        const departement = await Departement.create({
            nom,
            code,
            description,
            // Validez que chefDepartementId est un ID Mongoose valide, si fourni
            chefDepartementId: chefDepartementId && mongoose.Types.ObjectId.isValid(chefDepartementId) ? chefDepartementId : null
        });

        // Optionnel: Population du chef de département si vous voulez le retourner
        await departement.populate('chefDepartementId', 'firstName lastName email');
        
        res.status(201).json({
            message: "Département créé avec succès.",
            departement
        });

    } catch (error) {
        // Erreur d'unicité (code 11000) ou de validation (Mongoose)
        if (error.code === 11000) {
            return res.status(400).json({ message: "Un département avec ce nom ou ce code existe déjà." });
        }
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(el => el.message).join('; ');
            return res.status(400).json({ message: `Erreur de validation: ${errors}` });
        }
        res.status(500).json({ message: error.message });
    }
};

// --- 2. Récupérer TOUS les Départements (Utilisé par React) ---
exports.getDepartements = async (req, res) => {
    try {
        // Récupère tous les départements, triés par nom
        const departements = await Departement.find({})
            .sort({ nom: 1 })
            // Inclut les informations de base du chef de département pour l'affichage
            .populate('chefDepartementId', 'firstName lastName email role');

        res.status(200).json(departements);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- 3. Obtenir un Département par ID ---
exports.getDepartementById = async (req, res) => {
    try {
        const departement = await Departement.findById(req.params.id)
            .populate('chefDepartementId', 'firstName lastName email');

        if (!departement) {
            return res.status(404).json({ message: "Département non trouvé." });
        }

        res.status(200).json(departement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ajoutez ici d'autres fonctions comme updateDepartement et deleteDepartement