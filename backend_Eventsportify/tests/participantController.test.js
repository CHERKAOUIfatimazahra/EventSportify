const participantController = require("../controllers/participantController");
const User = require("../models/User");
const Event = require("../models/Event");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body, params = {}, query = {}) => ({
  body,
  params,
  query,
});

jest.mock("../models/User");
jest.mock("../models/Event");

describe("Participant Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createParticipant", () => {
    it("should create a new participant and add them to the event", async () => {
      const req = mockRequest(
        {
          name: "John Doe",
          email: "johndoe@example.com",
          phoneNumber: "1234567890",
        },
        { id: "event123" }
      );
      const res = mockResponse();
      Event.findById.mockResolvedValue({
        _id: "event123",
        participants: [],
        ticketsNumber: 10,
        save: jest.fn(),
      });

      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue({});
      Event.updateOne.mockResolvedValue({});

      await participantController.createParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Participant registered successfully for the event",
      });
      expect(User.prototype.save).toHaveBeenCalledTimes(1);
      expect(Event.updateOne).toHaveBeenCalledWith(
        { _id: req.params.id },
        { $inc: { ticketsNumber: -1 } }
      );
    });

    it("should return 400 if the participant is already registered for the event", async () => {
    const req = mockRequest(
      { email: "johndoe@example.com" },
      { id: "event123" }
    );
    const res = mockResponse();

    const mockExistingParticipant = {
      events: ["event123"],
      save: jest.fn(),
    };
    User.findOne.mockResolvedValue(mockExistingParticipant);

    await participantController.createParticipant(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email and at least name or phone number are required",
    });
    });

    it("should return 400 if required fields are missing", async () => {
      const req = mockRequest(
        { email: "johndoe@example.com" },
        { id: "event123" }
      );
      const res = mockResponse();

      await participantController.createParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email and at least name or phone number are required",
      });
    });

    it("should return 404 if the event does not exist", async () => {
      const req = mockRequest(
        {
          name: "John Doe",
          email: "johndoe@example.com",
          phoneNumber: "1234567890",
        }, 
        { id: "event123" }
      );
      const res = mockResponse();

      Event.findById.mockResolvedValue(null);

      await participantController.createParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Event not found",
      });
    });

    it("should return 500 if an error occurs during participant registration", async () => {
      const req = mockRequest(
        {
        name: "John Doe",
        email: "johndoe@example.com",
        phoneNumber: "1234567890",
        }, 
        { id: "event123" }
      );
      const res = mockResponse(null);

      Event.findById.mockResolvedValue({
        _id: "event123",
        participants: [],
        ticketsNumber: 10,
        save: jest.fn(),
      });

      User.findOne.mockResolvedValue(null);
      User.prototype.save.mockRejectedValue(new Error("Database error"));

      await participantController.createParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error registering participant",
        error: "Database error",
      });
    });
  });

  describe("getParticipants", () => {
    it("should retrieve all participants for an event", async () => {
      const req = mockRequest({}, { id: "event123" });
      const res = mockResponse();

      const mockParticipants = [
        { name: "John Doe", email: "johndoe@example.com" },
        { name: "Jane Smith", email: "janesmith@example.com" },
      ];
      User.find.mockResolvedValue(mockParticipants);

      await participantController.getParticipants(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        participants: mockParticipants,
        message: "Participants obtained successfully",
      });
    });

    it("should return a 500 status code and an error if participants cannot be retrieved", async () => {
      const req = mockRequest({}, { id: "event123" });
      const res = mockResponse();

      User.find.mockRejectedValue(new Error("Database error"));

      await participantController.getParticipants(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error obtaining participants",
        error: "Database error",
      });
    });
  });

  describe("deleteParticipant", () => {
    it("should remove a participant from an event", async () => {
      const req = mockRequest(
        { eventId: "event123" },
        { id: "participant123" }
      );
      const res = mockResponse();

      const mockParticipant = {
        events: ["event123", "event456"],
        save: jest.fn(),
      };

      User.findById.mockResolvedValue(mockParticipant);
      Event.updateOne.mockResolvedValue({});

      await participantController.deleteParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Participant removed from event successfully",
      });
      expect(mockParticipant.save).toHaveBeenCalledTimes(1);
    });

    it("should return 404 if the participant is not found", async () => {
      const req = mockRequest({
        eventId: "event123",
        participantId: "participant123",
      });
      const res = mockResponse();

      // Mock User.findById to return null (participant not found)
      User.findById.mockResolvedValue(null);

      await participantController.deleteParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Participant not found",
      });
    });

    it("should return 500 if an error occurs during participant deletion", async () => {
      const req = mockRequest({ eventId: "event123" }, { id: "participant123" });
      const res = mockResponse();

      User.findById.mockRejectedValue(new Error("Database error"));

      await participantController.deleteParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error removing participant from event",
        error: "Database error",
      });
    });
  });

  describe("updateParticipant", () => {

    it("should update a participant successfully", async () => {
      const req = mockRequest(
        { name: "Updated Name", email: "updated@example.com" },
        { id: "participant123" }
      );
      const res = mockResponse();

      const mockParticipant = { _id: "participant123", name: "Old Name" };

      User.findById.mockResolvedValue(mockParticipant);
      User.findByIdAndUpdate.mockResolvedValue({
        ...mockParticipant,
        name: "Updated Name",
        email: "updated@example.com",
      });

      await participantController.updateParticipant(req, res);

      expect(User.findById).toHaveBeenCalledWith("participant123");
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "participant123",
        req.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        updatedParticipant: {
          _id: "participant123",
          name: "Updated Name",
          email: "updated@example.com",
        },
        message: "Participant updated successfully",
      });
    });

    it("should return an error if the participant is not found", async () => {
      const req = mockRequest({}, { id: "nonexistentId" });
      const res = mockResponse();

      User.findById.mockResolvedValue(null);

      await participantController.updateParticipant(req, res);

      expect(User.findById).toHaveBeenCalledWith("nonexistentId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Participant not found",
      });
    });

    it("should return a server error if updating fails", async () => {
      const req = mockRequest({}, { id: "participant123" });
      const res = mockResponse();

      User.findById.mockRejectedValue(new Error("Database error"));

      await participantController.updateParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error updating participant",
        error: "Database error",
      });
    });
  });

  describe("getParticipantById", () => {
    
    it("should retrieve a participant successfully by ID", async () => {
      const req = mockRequest({}, { id: "participant123" });
      const res = mockResponse();

      const mockParticipant = {
        _id: "participant123",
        name: "John Doe",
        email: "johndoe@example.com",
      };

      User.findById.mockResolvedValue(mockParticipant);

      await participantController.getParticipantById(req, res);

      expect(User.findById).toHaveBeenCalledWith("participant123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockParticipant);
    });

    it("should return an error if the participant is not found", async () => {
      const req = mockRequest({}, { id: "nonexistentId" });
      const res = mockResponse();

      User.findById.mockResolvedValue(null);

      await participantController.getParticipantById(req, res);

      expect(User.findById).toHaveBeenCalledWith("nonexistentId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Participant not found",
      });
    });

    it("should return a server error if fetching fails", async () => {
      const req = mockRequest({}, { id: "participant123" });
      const res = mockResponse();

      User.findById.mockRejectedValue(new Error("Database error"));

      await participantController.getParticipantById(req, res);

      expect(User.findById).toHaveBeenCalledWith("participant123");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting participant by id",
        error: "Database error",
      });
    });
  });

});
