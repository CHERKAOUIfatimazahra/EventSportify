const Event = require("../models/Event");
const User = require("../models/User");

// creation d'evenement
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      price,
      ticketsNumber,
      image,
      organizer,
    } = req.body;

    // Vérification les champs
    if (
      !title ||
      !description ||
      !startDate ||
      !endDate ||
      !location ||
      !price ||
      !ticketsNumber
    ) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Création de l'événement
    const newEvent = new Event({
      title,
      description,
      startDate,
      endDate,
      location,
      price,
      ticketsNumber,
      image,
      organizer: req.user._id,
    });

    await newEvent.save(); 

    res.status(201).json({ newEvent, message: "Evenement cree avec succes" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la creation de l'evenement",
      error: error.message,
    });
  }
};

// update d'evenement
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Evenement non trouve" });
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ updatedEvent, message: "Evenement mis a jour avec succes" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise a jour de l'evenement",
      error: error.message,
    });
  }
};

// delete d'evenement
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Evenement non trouve" });
    }
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Evenement supprime avec succes" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'evenement",
      error: error.message,
    });
  }
};

// get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer");
    res
      .status(200)
      .json({
        events,
        message: "Tous les evenements ont ete obtenus avec succes",
      });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la recuperation de tous les evenements",
      error: error.message,
    });
  }
};
