
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const jwt = require("jsonwebtoken");

// Create a new booking
router.post("/", async (req, res) => {
  try {
    const { token, movie, showtime, seats } = req.body;

    if (!token) {
      return res.status(401).json({
        message: "Please login before booking.",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        message: "Your login session is invalid. Please login again.",
      });
    }

    if (
      !movie ||
      !showtime ||
      !Array.isArray(seats) ||
      seats.length === 0
    ) {
      return res.status(400).json({
        message: "Please select a movie, showtime, and seats.",
      });
    }

    // Check whether any selected seats are already booked
const existingBookings = await Booking.find({
  movie,
  showtime,
  "seats.0": { $exists: true },
});

const alreadyBookedSeats = existingBookings.flatMap(
  (booking) => booking.seats
);

const conflictingSeats = seats.filter((seat) =>
  alreadyBookedSeats.includes(seat)
);

if (conflictingSeats.length > 0) {
  return res.status(409).json({
    message: `These seats are already booked: ${conflictingSeats.join(", ")}. Please select different seats.`,
  });
}

    const booking = await Booking.create({
      user: decoded.userId,
      movie,
      showtime,
      seats,
      totalTickets: seats.length,
    });

    res.status(201).json({
      message: "Booking saved successfully!",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error.message);
    res.status(500).json({
      message: "Unable to save booking.",
    });
  }
});


// Get already-booked seats for a movie and showtime
router.get("/booked-seats", async (req, res) => {
  try {
    const { movie, showtime } = req.query;

    if (!movie || !showtime) {
      return res.status(400).json({
        message: "Movie and showtime are required.",
      });
    }

    const bookings = await Booking.find({ movie, showtime });
    
console.log("Checking:", movie, showtime);
console.log("Found bookings:", bookings);

    const bookedSeats = bookings.flatMap(
      (booking) => booking.seats
    );

    res.json({ bookedSeats });
  } catch (error) {
    console.error("Booked seats error:", error.message);
    res.status(500).json({
      message: "Unable to fetch booked seats.",
    });
  }
});

/* Get bookings for the logged-in user */
router.get("/my-bookings", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please login to view your bookings.",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        message: "Your login session is invalid. Please login again.",
      });
    }

    const bookings = await Booking.find({
  user: decoded.userId,
}).sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error.message);
    res.status(500).json({
      message: "Unable to fetch bookings.",
    });
  }
});


module.exports = router;
