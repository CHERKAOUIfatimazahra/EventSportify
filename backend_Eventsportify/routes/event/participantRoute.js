const express = require("express");
const router = express.Router();
const participantFunctions = require("../../controllers/participantController");
const { verifyToken } = require("../../middleware/authMiddleware");
const { isOrganizer } = require("../../middleware/roleMiddleware");

// create participents for a specific event
router.post(
  "/create/:id",
  verifyToken,
  isOrganizer,
  participantFunctions.createParticipant
);

// get all participants for a specific event
router.get(
  "/participants/:id",
  verifyToken,
  isOrganizer,
  participantFunctions.getParticipants
);

// delete a specific participant
router.delete(
  "/delete/:id",
  verifyToken,
  isOrganizer,
  participantFunctions.deleteParticipant
);

module.exports = router;
