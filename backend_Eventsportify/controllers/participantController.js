const User = require("../models/User");
const Event = require("../models/Event");

exports.createParticipant = async (req, res) => {
  try {
    // vérifier si le participant existe déjà
    let participant = await User.findOne({
      email: req.body.email,
      role: "participant",
    });

    if (participant) {
      // vérifiez si le participant est déjà inscrit à cet événement
      if (participant.events.includes(req.params.id)) {
        return res.status(400).json({
          message: "Participant already registered for this event",
        });
      }

      // Ajouter l'événement à la liste des événements du participant
      participant.events.push(req.params.id);
      await participant.save();

    } else {
      // Créer un nouveau participant
      participant = new User({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role: "participant",
        isVerified: true,
        events: [req.params.id],
      });
      await participant.save();
    }

    // Décrémenter le nombre de tickets pour l'événement
    await Event.updateOne({ _id: req.params.id }, { $inc: { tickets: -1 } });

    res.status(201).json({
      message: "Participant created/added to event successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating/adding participant",
      error: error.message,
    });
  }
};

exports.getParticipants = async (req, res) => {
  try {
    const participants = await User.find({
      role: "participant",
      events: req.params.id,
    });

    res.status(200).json({
      participants,
      message: "Participants obtained successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error obtaining participants",
      error: error.message,
    });
  }
};

exports.deleteParticipant = async (req, res) => {
  try {
    const participant = await User.findById(req.params.id);

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // Supprimer l'événement de la liste des événements du participant
    participant.events = participant.events.filter(
      (eventId) => eventId.toString() !== req.body.eventId
    );

    await participant.save();

    // Réincrémenter le nombre de tickets pour l'événement
    await Event.updateOne({ _id: req.body.eventId }, { $inc: { tickets: 1 } });

    if (participant.events.length === 0) {
      await User.findByIdAndDelete(req.params.id);
    }

    res
      .status(200)
      .json({ message: "Participant removed from event successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error removing participant from event",
      error: error.message,
    });
  }
};
