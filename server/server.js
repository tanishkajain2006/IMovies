
const express = require("express");
const bookingRoutes = require("./routes/bookingRoutes");
const movieRoutes = require("./routes/movieRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
console.log("JWT_SECRET loaded:", 
Boolean(process.env.JWT_SECRET));
console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to IMovies API!",
    status: "Server is running successfully",
  });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`IMovies server running at http://localhost:${PORT}`);
    });
  } catch (error) {
  console.error("MongoDB connection failed:", error);
  process.exit(1);
}
}

startServer();
