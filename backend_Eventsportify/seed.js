const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Event = require("./models/Event");

dotenv.config();

// Connexion à la base de données
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.error(err));

// Fonction de seed
const seedDatabase = async () => {
  try {
    // Vider les collections
    await User.deleteMany({});
    await Event.deleteMany({});

    // Créer des utilisateurs
    const users = await User.insertMany([
      {
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword1",
        phoneNumber: "1234567890",
        role: "organizer",
        isVerified: true,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "hashedPassword2",
        phoneNumber: "0987654321",
        role: "participant",
        isVerified: true,
      },
    ]);

    console.log("Users seeded:", users);

    // Créer des événements
    const events = await Event.insertMany([
      {
        title: "Tech Conference 2024",
        description: "A conference about the latest in tech.",
        startDate: new Date("2024-12-01"),
        endDate: new Date("2024-12-03"),
        location: "New York City",
        price: 50,
        image: "tech-conference.jpg",
        organizer: users[0]._id,
        participants: [users[1]._id],
        ticketsNumber: 100,
        status: "active",
      },
      {
        title: "Music Festival",
        description: "Enjoy a day of amazing music.",
        startDate: new Date("2024-11-20"),
        endDate: new Date("2024-11-21"),
        location: "Los Angeles",
        price: 75,
        image: "music-festival.jpg",
        organizer: users[0]._id,
        participants: [users[1]._id],
        ticketsNumber: 200,
        status: "active",
      },
    ]);

    console.log("Events seeded:", events);

    console.log("Database seeding completed!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Exécuter le seed
seedDatabase();
