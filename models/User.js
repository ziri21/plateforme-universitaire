const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Schéma du modèle User
const UserSchema = new mongoose.Schema(
    {
        // 1. Identification (Améliorée)
        matricule: {
            type: String,
            // 'unique' est nécessaire, 'sparse: true' permet les valeurs nulles pour l'admin
            unique: true, 
            sparse: true, 
            trim: true
        },
        // Remplacement de l'ancien champ 'name' par les deux champs suivants
        firstName: {
            type: String,
            required: [true, "Prénom requis"],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, "Nom de famille requis"],
            trim: true
        },
        
        // 2. Authentification et Rôle
        email: {
            type: String,
            required: [true, "Champs requis"],
            unique: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, 'Format invalide']
        },
        password: {
            type: String,
            required: [true, "Champs requis"],
            minlength: [6, "Au moins 6 caractères "]
        },
        role: {
            required: [true, "Champs requis"],
            type: String,
            enum: ["student", "professor", "admin"],
            default: "student"
        },
        
        // 3. Contexte Académique
        departementId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Departement', // Référence au modèle Departement
            default: null // Le département est optionnel pour l'admin
        },
        telephone: {
            type: String,
            default: null
        },
        adresse: {
            type: String,
            default: null
        },
        
        // 4. Gestion du compte et Metadata
        image: {
            type: String,
            default: null
        },
        statutCompte: { // Pour activer/désactiver le compte
            type: String,
            enum: ['actif', 'inactif', 'suspendu'],
            default: 'actif'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: { // Ajout pour le suivi des mises à jour
            type: Date,
            default: Date.now
        }
    }
);

// --- VALIDATIONS CONDITIONNELLES (Middlewares de Validation) ---

// 1. Validation Conditionnelle du Département
// Requis pour les étudiants et professeurs, facultatif pour l'administrateur
UserSchema.path('departementId').validate(function(value) {
    // Si le rôle est 'admin', la validation passe (le champ peut être null)
    if (this.role === 'admin') {
        return true;
    }
    // Pour les autres rôles, la valeur doit exister
    return !!value;
}, 'Le département est requis pour les étudiants et professeurs.');

// 2. Validation Conditionnelle du Matricule
// Requis pour les étudiants et professeurs, facultatif pour l'administrateur
UserSchema.path('matricule').validate(function(value) {
    // Si le rôle est 'admin', la validation passe
    if (this.role === 'admin') {
        return true;
    }
    // Pour les autres rôles, le matricule doit avoir une valeur
    return (value && value.length > 0);
}, 'Le matricule est requis pour les étudiants et professeurs.');

// --- HOOKS DE SAUVEGARDE ET MÉTHODES ---

// Hook 'pre' pour Hasher le mot de passe avant la sauvegarde
UserSchema.pre("save", async function (next) {
    // 1. Mise à jour de la date de modification
    this.updatedAt = Date.now(); 
    
    // 2. Hachage du mot de passe
    if (!this.isModified("password")) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); 
});

// Méthode pour comparer le mot de passe saisi avec celui haché en base
UserSchema.methods.comparer = async function(mdpSaisi){
    return bcrypt.compare(mdpSaisi, this.password);
};

module.exports = mongoose.model("User", UserSchema);