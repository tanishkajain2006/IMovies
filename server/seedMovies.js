
require("dotenv").config();
const mongoose = require("mongoose");
const Movie = require("./models/Movie");


const movies = [
  {
    title: "Jawan",
    description: "An action thriller packed with emotion and drama.",
    genre: "Action",
    duration: 169,
    rating: 7.0,
    poster: "https://www.impawards.com/intl/india/2023/posters/jawan.jpg",
    language: "Hindi",
    releaseDate: new Date("2023-09-07"),
  },
  {
    title: "3 Idiots",
    description: "Three friends discover the true meaning of learning and life.",
    genre: "Comedy",
    duration: 170,
    rating: 8.4,
    poster: "https://media.themoviedb.org/t/p/w440_and_h660_face/66A9MqXOyVFCssoloscw79z8Tew.jpg",
    language: "Hindi",
    releaseDate: new Date("2009-12-25"),
  },
  {
    title: "Dangal",
    description: "A former wrestler trains his daughters to become champions.",
    genre: "Drama",
    duration: 161,
    rating: 8.3,
    poster: "https://www.impawards.com/intl/india/2016/posters/dangal_xlg.jpg",
    language: "Hindi",
    releaseDate: new Date("2016-12-23"),
  },
];


async function seedMovies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Movie.deleteMany({});
    await Movie.insertMany(movies);
    console.log("Sample movies added successfully!");
  } catch (error) {
    console.error("Error adding movies:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedMovies();
