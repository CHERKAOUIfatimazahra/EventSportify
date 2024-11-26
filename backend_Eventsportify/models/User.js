const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return this.role !== "participant";
    },
  },
  phoneNumber: { type: String, required: true },
  role: {
    type: String,
    enum: ["organizer", "participant"],
    default: "organizer",
  },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  verificationToken: { type: String },
  lastOTPSentAt: { type: Date },

  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
