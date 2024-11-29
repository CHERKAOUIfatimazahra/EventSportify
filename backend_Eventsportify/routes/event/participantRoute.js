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
  "/event/:id",
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

// update a specific participant
router.put(
  "/update/:id",
  verifyToken,
  isOrganizer,
  participantFunctions.updateParticipant
);

// get a specific participant
router.get(
  "/:id",
  verifyToken,
  isOrganizer,
  participantFunctions.getParticipantById
);


module.exports = router;
