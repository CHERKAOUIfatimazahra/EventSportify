const request = require("supertest");
const express = require("express");
const eventRoutes = require("../routes/event/eventRoute");
const Event = require("../models/Event");
const { verifyToken } = require("../middleware/authMiddleware");
const { isOrganizer } = require("../middleware/roleMiddleware");

jest.mock("../middleware/authMiddleware", () => ({
  verifyToken: jest.fn((req, res, next) => {
    req.user = { _id: "mockUserId", role: "organizer" };
    next();
  }),
}));

jest.mock("../middleware/roleMiddleware", () => ({
  isOrganizer: jest.fn((req, res, next) => {
    if (req.user.role === "organizer") {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  }),
}));

jest.mock("../models/Event");

const app = express();
app.use(express.json());
app.use("/events", eventRoutes);

describe("Event Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /events/create", () => {
    it("should create a new event successfully", async () => {
      const eventData = {
        title: "Test Event",
        description: "Description",
        startDate: "2024-12-01",
        endDate: "2024-12-02",
        location: "Test Location",
        price: 100,
        ticketsNumber: 50,
      };

      Event.prototype.save = jest.fn().mockResolvedValue(eventData);

      const response = await request(app)
        .post("/events/create")
        .send(eventData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Evenement cree avec succes");
      expect(Event.prototype.save).toHaveBeenCalled();
    });

    it("should return an error when fields are missing", async () => {
      const response = await request(app)
        .post("/events/create")
        .send({ title: "" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Tous les champs sont requis.");
    });
  });

  describe("PUT /events/update/:id", () => {
    it("should update an event successfully", async () => {
      Event.findById = jest.fn().mockResolvedValue({ _id: "mockEventId" });
      Event.findByIdAndUpdate = jest
        .fn()
        .mockResolvedValue({ _id: "mockEventId", title: "Updated Title" });

      const response = await request(app)
        .put("/events/update/mockEventId")
        .send({ title: "Updated Title" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Evenement mis a jour avec succes");
      expect(Event.findById).toHaveBeenCalledWith("mockEventId");
      expect(Event.findByIdAndUpdate).toHaveBeenCalled();
    });

    it("should return an error if the event is not found", async () => {
      Event.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put("/events/update/mockEventId")
        .send({ title: "Updated Title" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Evenement non trouve");
    });
  });

  describe("DELETE /events/delete/:id", () => {
    it("should delete an event successfully", async () => {
      Event.findById = jest.fn().mockResolvedValue({ _id: "mockEventId" });
      Event.findByIdAndDelete = jest.fn().mockResolvedValue(true);

      const response = await request(app).delete("/events/delete/mockEventId");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Evenement supprime avec succes");
      expect(Event.findById).toHaveBeenCalledWith("mockEventId");
    });

    it("should return an error if the event is not found", async () => {
      Event.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete("/events/delete/mockEventId");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Evenement non trouve");
    });
  });

  describe("GET /events", () => {
    it("should retrieve all events successfully", async () => {
      const mockEvents = [
        { _id: "event1", title: "Event 1" },
        { _id: "event2", title: "Event 2" },
      ];

      Event.find = jest.fn().mockResolvedValue(mockEvents);

      const response = await request(app).get("/events/");

      expect(response.status).toBe(200);
      expect(response.body.events).toHaveLength(2);
      expect(response.body.message).toBe(
        "Tous les evenements ont ete obtenus avec succes"
      );
    });
  });

  describe("GET /events/organizer", () => {
    it("should retrieve all events for the authenticated organizer", async () => {
      const mockEvents = [
        { _id: "event1", title: "Event 1", organizer: "mockUserId" },
        { _id: "event2", title: "Event 2", organizer: "mockUserId" },
      ];

      Event.find = jest.fn().mockResolvedValue(mockEvents);

      const response = await request(app).get("/events/organizer");

      expect(response.status).toBe(200);
      expect(response.body.events).toHaveLength(2);
      expect(response.body.message).toBe(
        "Tous les evenements de l'organisateur ont ete obtenus avec succes"
      );
      expect(Event.find).toHaveBeenCalledWith({ organizer: "mockUserId" });
    });

    it("should return 404 if no events are found", async () => {
      Event.find = jest.fn().mockResolvedValue([]);

      const response = await request(app).get("/events/organizer");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Aucun evenement trouve");
    });

    it("should return 500 if there is a server error during fetching", async () => {
      Event.findById = jest.fn().mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/events/mockEventId");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        "Erreur lors de la recuperation de l'evenement"
      );
      expect(response.body.error).toBe("Database error");
    });

  });

  describe("GET /events/:id", () => {
    it("should return an error if the event is not found", async () => {
      Event.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app).get("/events/mockEventId");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Evenement non trouve");
    });

    it("should return 404 if the event does not exist", async () => {
      Event.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app).get("/events/mockEventId");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Evenement non trouve");
    });

    it("should return 500 if there is a server error during fetching", async () => {
      Event.findById = jest.fn().mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/events/mockEventId");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        "Erreur lors de la recuperation de l'evenement"
      );
      expect(response.body.error).toBe("Database error");
    });
  });
});
