
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movie: {
      type: String,
      required: true,
    },
    showtime: {
      type: String,
      required: true,
    },
    seats: {
      type: [String],
      required: true,
    },
    totalTickets: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
