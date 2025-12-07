document.addEventListener("DOMContentLoaded", () => {
  const movieGrid = document.getElementById("movieGrid");
  const searchInput = document.getElementById("movieSearch");
  const searchBtn = document.getElementById("searchBtn");

  const API_BASE = "http://127.0.0.1:8000/api/movies/"; // backend API
  let debounceTimer;

  // Initial prompt
  movieGrid.innerHTML = "<p>Type something to search for movies.</p>";

  // Fetch and display movies
  async function fetchMovies(query = "") {
    query = query.trim();
    if (!query) {
      movieGrid.innerHTML = "<p>Type something to search for movies.</p>";
      return;
    }

    const url = `${API_BASE}movies/?q=${encodeURIComponent(query)}`;
    movieGrid.innerHTML = "<p>Loading...</p>";

    try {
      const res = await fetch(url);
      console.log("Fetch URL:", url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const movies = await res.json();

      if (!movies || movies.length === 0) {
        movieGrid.innerHTML = "<p>No movies found.</p>";
        return;
      }

      // Render movies
      movieGrid.innerHTML = movies
        .map(
          (m) => `
          <a href="movie.html?id=${m.id}" class="movie-card">
            <img src="${m.poster || 'images/default-poster.jpg'}" alt="${m.title} Poster" />
            <h3>${m.title}</h3>
            <p>⭐ ${m.rating || "—"}</p>
          </a>
        `
        )
        .join("");
    } catch (err) {
      console.error("Error fetching movies:", err);
      movieGrid.innerHTML = "<p>Error loading movies. Check console.</p>";
    }
  }

  // Debounce helper
  function debounceSearch(fn, delay = 300) {
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Event: Search on typing
  searchInput.addEventListener(
    "keyup",
    debounceSearch((e) => fetchMovies(e.target.value), 300)
  );

  // Event: Search on Enter key
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") fetchMovies(searchInput.value);
  });

  // Event: Search on button click
  searchBtn.addEventListener("click", () => fetchMovies(searchInput.value));
});
