const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Récupérer le token
    if (!token) {
      return res.status(403).json({ message: "Accès refusé. Token manquant." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // Attache l'utilisateur au req
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide ou expiré." });
  }
};
