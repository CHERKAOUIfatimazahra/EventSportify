const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth/authRoutes");
const eventRoutes = require("./routes/event/eventRoute");
const participantRoutes = require("./routes/event/participantRoute");
const cors = require("cors");

const app = express();
dotenv.config();
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Middleware pour traiter les requêtes JSON
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/participants", participantRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
