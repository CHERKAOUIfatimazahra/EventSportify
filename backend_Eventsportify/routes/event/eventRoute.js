const express = require("express");
const router = express.Router();
const eventController = require("../../controllers/eventController");
const { verifyToken } = require("../../middleware/authMiddleware");
const { isOrganizer } = require("../../middleware/roleMiddleware");

// creation event
router.post("/create", verifyToken, isOrganizer, eventController.createEvent);

// update event
router.put(
  "/update/:id",
  verifyToken,
  isOrganizer,
  eventController.updateEvent
);

// delete event
router.delete(
  "/delete/:id",
  verifyToken,
  isOrganizer,
  eventController.deleteEvent
);

// get all events
router.get("/", eventController.getAllEvents);

module.exports = router;
