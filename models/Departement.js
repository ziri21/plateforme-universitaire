const mongoose = require("mongoose");

const DepartementSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: [true, "Le nom du département est requis."],
            unique: true,
            trim: true
        },
        code: {
            type: String,
            required: [true, "Le code (ou acronyme) du département est requis."],
            unique: true, 
            uppercase: true,
            trim: true,
            // 📚 AJOUT DE L'ENUMÉRATION DES CODES DE DÉPARTEMENTS UMMTO
            enum: [
                "INFO", // Informatique
                "ELEC", // Électronique
                "DGE",  // Génie Électrique
                "DGC",  // Génie Civil
                "GM",   // Génie Mécanique
                "BIO",  // Biologie
                "PHA",  // Pharmacie
                "SE",   // Sciences Économiques
                "DRT",  // Droit
                "LFF",  // Langue et Littérature Française
                "LA",   // Langue Anglaise
                "SH",   // Sciences Humaines
                "STAPS", // Sciences et Techniques des Activités Physiques et Sportives
                "BIOMED"
            ],
            message: "Le code du département n'est pas valide."
        },
        description: {
            type: String,
            default: "Département académique sans description détaillée.",
            trim: true
        },
        chefDepartementId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model("Departement", DepartementSchema);