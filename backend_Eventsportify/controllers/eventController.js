const Event = require("../models/Event");

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
    } = req.body;

    // Vérification des champs
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
    const events = await Event.find();
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

// get all events by organizer
exports.getAllEventsByOrganizer = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id });

    if(events.length === 0) {
      return res.status(404).json({ message: "Aucun evenement trouve" });
    }

    res
      .status(200)
      .json({
        events,
        message: "Tous les evenements de l'organisateur ont ete obtenus avec succes",
      });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la recuperation de tous les evenements de l'organisateur",
      error: error.message,
    });
  }
};

// get event by id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Evenement non trouve" });
    }
    res.status(200).json({ event, message: "Evenement obtenu avec succes" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la recuperation de l'evenement",
      error: error.message,
    });
  }
};



