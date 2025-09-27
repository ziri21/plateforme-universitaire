const User = require("../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Fonction utilitaire pour générer le Token JWT
const generateToken = async (user) => {
    // Ajout de matricule dans le token si présent
    return await jwt.sign(
        { id: user._id, role: user.role, matricule: user.matricule || null },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// Fonction utilitaire pour extraire le nom complet pour la réponse
const getDisplayName = (user) => {
    // Si les nouveaux champs existent, on les utilise. Sinon, on utilise l'ancien champ 'name'.
    if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
    }
    return user.name || 'Utilisateur'; // Utilise l'ancien champ 'name' si les nouveaux n'existent pas
};

// --- Création d'un utilisateur (Inscription) ---
exports.createUser = async (req, res) => {
    // Extraction des anciens ET nouveaux champs
    const { name, firstName, lastName, email, password, role, matricule, departementId } = req.body;
    
    // Déterminer les champs de nom à utiliser pour la création
    let nameFields = {};
    if (firstName && lastName) {
        // Nouvelle structure préférée
        nameFields = { firstName, lastName };
    } else if (name) {
        // Compatibilité avec l'ancienne structure: si 'name' est là, on l'utilise directement
        nameFields = { name };
    } else {
        // Mongoose devrait gérer le "required" des champs, mais on s'assure qu'un nom est là.
        // Si vous avez rendu firstName et lastName 'required' dans le modèle, Mongoose lèvera une erreur.
        // On laisse Mongoose gérer la validation
    }

    try {
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ message: "Utilisateur existe déjà" });
        }
        
        const user = await User.create({
            ...nameFields, // Les champs name, firstName ou lastName
            email,
            password,
            role: role || 'student',
            matricule: matricule || null,
            departementId: departementId || null,
            image: req.body.image || null,
        });

        // Suppression du mot de passe avant l'envoi de la réponse
        user.password = undefined; 

        return res.status(201).json({
            message: "Utilisateur créé",
            id: user._id,
            name: getDisplayName(user), // Utilise la fonction de compatibilité
            email: user.email,
            role: user.role,
            image: user.image,
            createdAt: user.createdAt,
            token: await generateToken(user),
        });
    } catch (err) {
        // Gestion des erreurs de validation Mongoose (y compris les nouveaux champs requis)
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message).join('; ');
            return res.status(400).json({ message: `Erreur de validation: ${errors}` });
        }
        return res.status(500).json({ message: err.message });
    }
};

// --- Connexion de l'utilisateur ---
exports.login = async (req, res) => {
    try {
        const exists = await User.findOne({ email: req.body.email });
        
        if (!exists || !(await exists.comparer(req.body.password))) {
            return res.status(401).json({ message: "Utilisateur non reconnu" });
        }

        // Vérification du statut (Ajouté pour le réalisme)
        if (exists.statutCompte === 'inactif' || exists.statutCompte === 'suspendu') {
            return res.status(403).json({ message: "Compte inactif. Contactez l'administration." });
        }

        return res.status(200).json({
            message: "Connexion réussie",
            id: exists._id,
            name: getDisplayName(exists), // Utilise la fonction de compatibilité
            email: exists.email,
            role: exists.role,
            image: exists.image,
            createdAt: exists.createdAt,
            token: await generateToken(exists),
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// --- Récupération du Profil ---
exports.getProfile = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    
    // Convertir l'objet Mongoose pour supprimer le mot de passe
    const profile = user.toObject({ getters: true });
    delete profile.password;
    delete profile.updatedAt;

    // Ajouter le champ 'name' compatible pour les clients existants
    profile.name = getDisplayName(user);
    
    return res.status(200).json(profile);
};

// --- Mise à Jour du Profil ---
exports.updateMyProfil = async (req, res) => {
    try {
        // Extraction des anciens ET nouveaux champs (y compris les nouveaux champs personnels)
        const { name, firstName, lastName, password, email, telephone, adresse } = req.body;
        const id = req.user._id;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        // LOGIQUE NON CASSANTE POUR LE NOM
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        
        // Si l'ancien champ 'name' est mis à jour, on l'utilise pour la compatibilité
        // NOTE: Si le client envoie 'name', cela n'affectera pas firstName/lastName.
        // Idéalement, les clients devraient migrer vers firstName/lastName.
        if (name) user.name = name; 
        
        // Mise à jour des champs existants/nouveaux
        if (email) user.email = email;
        if (telephone) user.telephone = telephone;
        if (adresse) user.adresse = adresse;

        // Gestion du fichier image (inchangée)
        if (req.file) {
            user.image = req.file.buffer.toString("base64");
        }

        // Mise à jour du mot de passe
        if (password && password.trim() !== "") {
            user.password = password;
        }

        const updatedUser = await user.save();
        
        // Nettoyage et réponse
        updatedUser.password = undefined;

        res.status(200).json({
            message: "Profil mis à jour avec succès",
            data: {
                id: updatedUser._id,
                // Utilisation de la fonction pour le retour de compatibilité
                name: getDisplayName(updatedUser), 
                email: updatedUser.email,
                role: updatedUser.role,
                image: updatedUser.image,
                matricule: updatedUser.matricule || null,
                // ... (tous les autres champs mis à jour si nécessaire)
            },
        });
    } catch (err) {
         // Gestion des erreurs de validation ou d'unicité (email)
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message).join('; ');
            return res.status(400).json({ message: `Erreur de validation: ${errors}` });
        }
        if (err.code === 11000) {
             return res.status(400).json({ message: "Un champ unique (email/matricule) est déjà utilisé." });
        }
        res.status(500).json({ message: err.message });
    }
};

// --- Récupération de tous les utilisateurs ---
exports.getUsers = async (req, res) => {
    // Population du département et exclusion des champs sensibles
    const users = await User.find()
        .select('-password -__v -updatedAt') // Exclure les champs sensibles
        .populate('departementId', 'nom code'); // Remplacer l'ID par le nom/code du département (si besoin)

    // Modification pour assurer la compatibilité 'name' dans la liste de retour
    const usersData = users.map(user => {
        const userData = user.toObject();
        userData.name = getDisplayName(user);
        return userData;
    });
    
    return res.status(200).json(usersData);
};