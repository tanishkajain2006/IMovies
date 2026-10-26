
import { useEffect, useState } from "react";
import "./App.css";


function App() {
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showtime, setShowtime] = useState("");
  const [bookedSeats, setBookedSeats] = useState([]);

  const [movies, setMovies] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [showAuth, setShowAuth] = useState(false);
const [authMode, setAuthMode] = useState("login");
const [authName, setAuthName] = useState("");
const [authEmail, setAuthEmail] = useState("");
const [authPassword, setAuthPassword] = useState("");
const [authMessage, setAuthMessage] = useState("");
const [authLoading, setAuthLoading] = useState(false);
const [currentUser, setCurrentUser] = useState(null);
const [authToken, setAuthToken] = useState("");
const [myBookings, setMyBookings] = useState([]);
const [showMyBookings, setShowMyBookings] = useState(false);
const [bookingsLoading, setBookingsLoading] = useState(false);
const [bookingsError, setBookingsError] = useState("");
const [bookingSuccess, setBookingSuccess] = useState("");

useEffect(() => {
  fetch("http://localhost:5000/api/movies")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Movies load nahi ho paayi");
      }
      return response.json();
    })
    .then((data) => {
      setMovies(data);
      setLoading(false);
    })
    .catch(() => {
      setError("Movies load nahi ho paayi. Backend check karo.");
      setLoading(false);
    });
}, []);


const handleAuthSubmit = async (event) => {
  event.preventDefault();
  setAuthMessage("");
  setAuthLoading(true);

  const endpoint = authMode === "signup" ? "signup" : "login";

  const payload =
    authMode === "signup"
      ? {
          name: authName,
          email: authEmail,
          password: authPassword,
        }
      : {
          email: authEmail,
          password: authPassword,
        };

  try {
    const response = await fetch(
      `http://localhost:5000/api/auth/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    if (authMode === "signup") {
      setAuthMode("login");
      setAuthName("");
      setAuthPassword("");
      setAuthMessage("Account created successfully! Please log in.");
    } else {
      setCurrentUser(data.user);
      setAuthToken(data.token);
      setShowAuth(false);
      setAuthEmail("");
      setAuthPassword("");
      setAuthMessage("");
    }
  } catch (error) {
    setAuthMessage(error.message);
  } finally {
    setAuthLoading(false);
  }
};


  const filteredMovies = movies.filter((movie) =>
  movie.title.toLowerCase().includes(search.toLowerCase())
);



useEffect(() => {
  if (!selectedMovie || !showtime) {
    setBookedSeats([]);
    return;
  }

  const fetchBookedSeats = async () => {
    try {
      const params = new URLSearchParams({
        movie: selectedMovie.title,
        showtime,
      });

      const response = await fetch(
        `http://localhost:5000/api/bookings/booked-seats?${params}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch booked seats.");
      }

      console.log("Booked seats from backend:", data.bookedSeats);
      setBookedSeats(data.bookedSeats || []);
    } catch (error) {
      console.error("Fetch booked seats error:", error);
    }
  };

  fetchBookedSeats();
}, [selectedMovie, showtime]);



  return (
    <div className="app">
      <nav className="navbar">
        <a href="#home" className="logo">
          i<span>MOVIES</span>
          <span className="logo-dot">.</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#movies">Movies</a>
          <a href="#about">About</a>
        </div>


        
<div className="auth-buttons">
  {currentUser ? (
    <>
      <span className="user-greeting">
        Hi, {currentUser.name}
      </span>

      <button
  className="login-button"
  onClick={async () => {
    if (!authToken) {
      setBookingsError("Please login to view your bookings.");
      return;
    }

    setShowMyBookings(true);
    setBookingsLoading(true);
    setBookingsError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load bookings.");
      }

      setMyBookings(data.bookings || []);
    } catch (error) {
      setBookingsError(error.message);
    } finally {
      setBookingsLoading(false);
    }
  }}
>
  My Bookings
</button>

      <button
        className="login-button"
        onClick={() => {
          setCurrentUser(null);
          setAuthToken("");
          setAuthMessage("");
        }}
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <button
        className="login-button"
        onClick={() => {
          setAuthMode("login");
          setAuthMessage("");
          setShowAuth(true);
        }}
      >
        Login
      </button>

      <button
        className="signup-button"
        onClick={() => {
          setAuthMode("signup");
          setAuthMessage("");
          setShowAuth(true);
        }}
      >
        Sign Up
      </button>
    </>
  )}
</div>


        <a className="nav-button" href="#movies">
          Book tickets <span>↗</span>
        </a>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="live-dot" />
              YOUR NEXT MOVIE NIGHT STARTS HERE
            </div>

            <h1>
              Every story.
              <br />
              One <span>big screen.</span>
            </h1>

            <p>
              Discover incredible movies, find your perfect showtime,
              and book your seats in just a few clicks.
            </p>

            <div className="hero-actions">
              <a href="#movies" className="primary-button">
                Explore movies <span>→</span>
              </a>
              <a href="#about" className="secondary-button">
                Discover IMovies
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>4K</strong>
                <span>Movie discovery</span>
              </div>
              <div>
                <strong>Easy</strong>
                <span>Seat selection</span>
              </div>
              <div>
                <strong>Fast</strong>
                <span>Secure booking</span>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-glow" />
            <div className="floating-label">
              <span>✦</span> YOUR CINEMA, YOUR WAY
            </div>
            <div className="hero-poster">
              <img
                src={movies[0]?.poster || "https://placehold.co/300x450?text=IMovies"}
                alt="Featured movie poster"
              />
              <div className="poster-overlay">
                <span className="poster-kicker">FEATURED FILM</span>
                <h2>{movies[0]?.title || "Discover Movies"}</h2>
                <p>Adventure awaits beyond the stars.</p>
                <a href="#movies">Find showtimes ↗</a>
              </div>
            </div>
            <div className="floating-rating">
              <span className="star">★</span>
              <div>
                <strong>8.5 / 10</strong>
                <small>Audience favourite</small>
              </div>
            </div>
          </div>
        </section>

        <section className="movies-section" id="movies">
          <div className="section-heading">
            <div>
              <span className="section-label">HANDPICKED FOR YOU</span>
              <h2>Now showing<span>.</span></h2>
              <p>Find your next favourite film.</p>
            </div>

            <div className="search-box">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search movies"
              />
            </div>
          </div>

          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <article className="movie-card" key={movie.title}>
                <div className="movie-poster">
                  <img src={movie.poster} alt={movie.title} />
                  <span className="movie-tag">{movie.language}</span>
                  <span className="movie-rating">
                    <span>★</span> {movie.rating}
                  </span>
                </div>

                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.genre}</p>
                  
<button
  type="button"
  className="movie-book-button"
  onClick={() => {
    setSelectedMovie(movie);
    document.getElementById("booking")?.scrollIntoView({
      behavior: "smooth",
    });
  }}
>
  Book tickets <span>→</span>
</button>

                </div>
              </article>
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <div className="empty-state">
              No movies found. Try another title.
            </div>
          )}
        </section>

        <section className="booking-banner" id="booking">
          <div>
            <span className="section-label">THE PERFECT NIGHT OUT</span>
            <h2>Your seat. Your movie. Your moment.</h2>
            
{selectedMovie && (
  <p className="selected-movie">
    Selected movie: <strong>{selectedMovie.title}</strong>
  </p>
)}

            <p>
              Your cinema experience is just a few clicks away.
            </p>

            

{selectedMovie && (
  <>
    <div className="booking-options">
      <label htmlFor="showtime">Choose showtime:</label>

      <select id="showtime" defaultValue="">
        <option value="" disabled>
          Select a show
        </option>
        <option value="10:00 AM">10:00 AM</option>
        <option value="1:30 PM">1:30 PM</option>
        <option value="6:00 PM">6:00 PM</option>
        <option value="9:30 PM">9:30 PM</option>
      </select>

{bookingSuccess && (
  <p className="booking-success">
    {bookingSuccess}
  </p>
)}

      <button
        type="button"
        

onClick={async () => {
  const showtime = document.getElementById("showtime").value;

  if (!currentUser || !authToken) {
    alert("Please login before booking!");
    setAuthMode("login");
    setShowAuth(true);
    return;
  }

  if (!showtime) {
    alert("Please select a showtime first!");
    return;
  }

  if (selectedSeats.length === 0) {
    alert("Please select at least one seat!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: authToken,
        movie: selectedMovie.title,
        showtime,
        seats: selectedSeats,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Booking failed.");
    }

   

    setBookingSuccess(
  `Booking confirmed! ${selectedMovie.title} — ${showtime}. Seats: ${selectedSeats.join(", ")}`
);

    setSelectedSeats([]);
  } catch (error) {
    alert(error.message || "Unable to save booking.");
  }
}}


            >
        Confirm Booking →
      </button>
    </div>

    <div className="seat-selection">
      <h3>Choose Your Seats</h3>


<div className="seat-grid">
  {Array.from({ length: 20 }, (_, index) => {
    const seatId = `${String.fromCharCode(
      65 + Math.floor(index / 5)
    )}${(index % 5) + 1}`;

    const isBooked = bookedSeats.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);

    return (
      <button
        key={seatId}
        type="button"
        disabled={isBooked}
        className={`seat ${
          isSelected ? "seat-selected" : ""
        } ${isBooked ? "seat-booked" : ""}`}
        onClick={() => {
          setSelectedSeats((previousSeats) =>
            previousSeats.includes(seatId)
              ? previousSeats.filter((seat) => seat !== seatId)
              : [...previousSeats, seatId]
          );
        }}
      >
        {seatId}
      </button>
    );
  })}
</div>
    </div>
  </>
)}



          </div>
          <a href="#movies" className="primary-button">
            Find your movie ↗
          </a>
        </section>

        
<section
  className="about-section"
  id="my-bookings"
>
  <span className="section-label">YOUR MOVIE HISTORY</span>
  <h2>My Bookings<span>.</span></h2>

  {showMyBookings && (
    <div className="my-bookings-list">
      {bookingsLoading ? (
        <p>Loading your bookings...</p>
      ) : bookingsError ? (
        <p>{bookingsError}</p>
      ) : myBookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        myBookings.map((booking) => (
          <article
            className="movie-card"
            key={booking._id}
          >
            <div className="movie-info">
              <h3>{booking.movie}</h3>
              <p>Showtime: {booking.showtime}</p>
              <p>Seats: {booking.seats.join(", ")}</p>
              <p>Total tickets: {booking.totalTickets}</p>
              <p>
                Booked on:{" "}
                {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            </div>
          </article>
        ))
      )}
    </div>
  )}

  {!showMyBookings && (
    <p>Click "My Bookings" in the navbar to view your tickets.</p>
  )}
</section>


        <section className="about-section" id="about">
          <span className="section-label">ABOUT IMOVIES</span>
          <h2>Less planning. More popcorn.</h2>
          <p>
            IMovies makes discovering films and finding your next
            cinema experience simple. Browse titles, explore your
            options, and get ready for movie night.
          </p>
        </section>
      </main>

      <footer className="footer">
        <a href="#home" className="logo">
          i<span>MOVIES</span><span className="logo-dot">.</span>
        </a>
        <p>Made for movie lovers. © 2026 IMovies.</p>
        <a href="#home">Back to top ↑</a>
      </footer>

      
      {showAuth && (
        <div
          className="auth-overlay"
          onClick={() => setShowAuth(false)}
        >
          <div
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="auth-close"
              type="button"
              onClick={() => setShowAuth(false)}
              aria-label="Close popup"
            >
              ×
            </button>

            <span className="section-label">WELCOME TO IMOVIES</span>

            <h2 id="auth-title">
              {authMode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p>
              {authMode === "login"
                ? "Log in to continue your movie journey."
                : "Sign up and get ready for movie night."}
            </p>

            <form onSubmit={handleAuthSubmit}>
              {authMode === "signup" && (
                <input
                  type="text"
                  placeholder="Your name"
                  value={authName}
                  onChange={(event) => setAuthName(event.target.value)}
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email address"
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password (minimum 8 characters)"
                value={authPassword}
                onChange={(event) => setAuthPassword(event.target.value)}
                minLength={8}
                required
              />

              <button type="submit" disabled={authLoading}>
                {authLoading
                  ? "Please wait..."
                  : authMode === "login"
                    ? "Login"
                    : "Create account"}
              </button>
            </form>

            {authMessage && (
              <p role="status" className="auth-message">
                {authMessage}
              </p>
            )}

            <p className="auth-switch">
              {authMode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={() => {
                  setAuthMode(
                    authMode === "login" ? "signup" : "login"
                  );
                  setAuthMessage("");
                }}
              >
                {authMode === "login" ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      )}


    </div>
  );
}

export default App;
