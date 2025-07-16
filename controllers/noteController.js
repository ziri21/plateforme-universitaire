const Inscription = require("../models/Inscription");
const Cours = require("../models/Cours");
const Note = require("../models/Note");

exports.addGrade = async (req, res) => {
    const { student, course, value } = req.body;
    const prof = req.user;
    try {
        const inscrit = await Inscription.findOne({ student: student, course: course });

        if (inscrit) {
            const cours = await Cours.findById({ _id: inscrit.course._id }).populate("professor");

            if (cours.professor._id.toString() === prof._id.toString()) {
                const note = await Note.create({ student, course, value });

                return res.status(201).json({ message: "note ajoutee avec succes", note });
            } else {
                return res.status(404).json({ message: "inscription non retrouvee" });
            }
        } else {
            return res.status(404).json({ message: "cours non retrouvee ou acces interdit a l'utilisateur" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.updateGrade = async (req, res) => {
    const { id } = req.params;
    const { student, course, value } = req.body;
    const prof = req.user;
    try {
        const inscrit = await Inscription.findOne({ student: student, course: course });

        if (inscrit) {
            const cours = await Cours.findById({ _id: inscrit.course._id }).populate("professor");

            if (cours.professor._id.toString() === prof._id.toString()) {
                const note = await Note.findByIdAndUpdate(id, { value }, { new: true, runValidators: true });
                if (note) {
                    return res.status(201).json({ message: "note modifiee avec succes", note });
                }
            } else {
                return res.status(404).json({ message: "inscription non retrouvee" });
            }
        } else {
            return res.status(404).json({ message: "cours non retrouvee ou acces interdit a l'utilisateur" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


exports.getGradesByStudent=async(req,res)=>{
const id_student=req.user._id;

try
{const notes=await Note.find({student:id_student}).populate("course");
if(!notes){
    return res.status(404).json({message:"notes non retrouve"})
}
const LesNotesReel=notes.map(n=>n.value)
const moyenne=LesNotesReel.reduce((a,b)=>a+b)/LesNotesReel.length

return res.status(200).json({message:"vos notes sont ",data:notes,moyenne:moyenne})
}catch(err){
 return res.status(500).json({message:err.message})
}
}
exports.getGradesByCourse=async(req,res)=>{
    const prof_id=req.user._id;
    const code=req.query.code
   
    try{
    const cours= await Cours.findOne({code:code})
const notesEtudiantsParCour= await Note.find({course: {$in :cours}})

if(cours.length===0){
    return res.status(404).json({message:"cours non retrouvé"})

}

if(cours.professor.toString()!==prof_id.toString()){
    return res.status(403).json({message:"acces interdit vous n'etes pas le prof de ce cours "});
}

if(!notesEtudiantsParCour){
    return res.status(404).json({message:"notes introuvables"})
}
return res.status(200).json({message:"les notes des etudiant du cours sont",notesEtudiantsParCour})
}catch(err){
    return res.status(500).json({message:err.message})
}
}