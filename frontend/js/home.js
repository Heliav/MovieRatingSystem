const container = document.getElementById('trendingMovies');
const API_BASE = "http://127.0.0.1:8000/api/movies/movies/";

// IDs of 3 trending movies (replace with real IDs from your DB)
const TRENDING_IDS = [1, 2, 3]; // Example: Inception, Matrix, Interstellar

// Fetch a single movie by ID
async function fetchMovie(id) {
  try {
    const res = await fetch(`${API_BASE}${id}/`);
    if (!res.ok) throw new Error("Failed to load movie");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Load trending movies
async function loadTrendingMovies() {
  container.innerHTML = "";
  for (let id of TRENDING_IDS) {
    const movie = await fetchMovie(id);
    if (!movie) continue;

    const card = document.createElement('div');
    card.classList.add('movie-card', 'fade-in');
    card.style.cursor = 'pointer';
    card.onclick = () => {
      window.location.href = `movie.html?id=${movie.id}`;
    };

    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.rating || "N/A"}</p>
    `;
    container.appendChild(card);
  }
}

// Initialize
loadTrendingMovies();
