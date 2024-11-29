const User = require("../models/User");
const Event = require("../models/Event");

exports.createParticipant = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const eventId = req.params.id;

    // Validate
    if (!email || (!name && !phoneNumber)) {
      return res.status(400).json({
        message: "Email and at least name or phone number are required",
      });
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.ticketsNumber === 0) {
      return res.status(400).json({
        message: "No tickets available for this event",
      });
    }

    // Check if the participant exists
    let participant = await User.findOne({ email, role: "participant" });

    if (participant) {
      // Check if the participant is already registered for this event
      if (participant.events.includes(eventId)) {
        return res.status(400).json({
          message: "Participant already registered for this event",
        });
      }

      // Add the event to the participant's events list
      participant.events.push(eventId);
      await participant.save();

    } else {
      // Create a new participant
      participant = new User({
        name,
        email,
        phoneNumber,
        role: "participant",
        isVerified: true,
        events: [eventId],
      });
      await participant.save();
    }

    // Add the participant not already participated
    if (!event.participants.includes(participant._id)) {
      event.participants.push(participant._id);
      await event.save();
    }

    // Decrement the number of tickets for the event
    if (event.ticketsNumber > 0) {
      await Event.updateOne({ _id: eventId }, { $inc: { ticketsNumber: -1 } });
    } else {
      return res.status(400).json({
        message: "No tickets available for this event",
      });
    }

    res.status(201).json({
      message: "Participant registered successfully for the event",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering participant",
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
    // Validate
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Find the participant by ID
    const participant = await User.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // Check if the event exists in the participant's events list
    const eventIndex = participant.events.findIndex(
      (id) => id.toString() === eventId
    );

    if (eventIndex === -1) {
      return res
        .status(400)
        .json({ message: "Event not found for participant" });
    }

    // Remove the event from the participant's events list
    participant.events.splice(eventIndex, 1);
    await participant.save();

    // Increment the tickets for the event
    await Event.updateOne({ _id: eventId }, { $inc: { ticketsNumber: 1 } });

    // Remove the participant from the event's participants list
    const event = await Event.findById(eventId);
    const participantIndex = event.participants.findIndex(
      (id) => id.toString() === req.params.id
    );
    if (participantIndex !== -1) {
      event.participants.splice(participantIndex, 1);
      await event.save();
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

// update participant
exports.updateParticipant = async (req, res) => {
  try {
    const participant = await User.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }
    const updatedParticipant = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ updatedParticipant, message: "Participant updated successfully" });
  } catch (error) {
    res.status(500).json({  
      message: "Error updating participant",
      error: error.message,
    });
  }
};

// get participant by id
exports.getParticipantById = async (req, res) => {
  try {
    const participant = await User.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }
    res.status(200).json(participant);
  } catch (error) {
    res.status(500).json({
      message: "Error getting participant by id",
      error: error.message
    });
  }
};
