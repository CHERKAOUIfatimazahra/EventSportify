const mongoose = require("mongoose");
const user = require("./User");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v > this.startDate;
      },
      message: "End date must be after the start date!",
    },
  },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  ticketsNumber: { type: Number, required: true },
  status: { type: String, enum: ["active", "cancelled"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the updatedAt field before save
eventSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Event", eventSchema);
