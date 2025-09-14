

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const coursRoutes = require("./routers/coursRouter"); // fichier correct
const userRoutes = require("./routers/userRouter");   // fichier correct
const inscriptionRouter= require("./routers/inscriptionRouter");   // fichier correct
const noteRouter=require("./routers/noteRouter");
const notificationRouter=require("./routers/notificationRouter")
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/cours", coursRoutes); 
app.use("/api/users", userRoutes); 
app.use("/api/inscriptions", inscriptionRouter);
app.use("/api/notes",noteRouter);
app.use("/api/notifications",notificationRouter)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" Connecté à MongoDB"))
  .catch(err => console.error(" Erreur MongoDB :", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Serveur lancé sur http://localhost:${PORT}`);
});
