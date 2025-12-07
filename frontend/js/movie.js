let currentMovie = null;

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");
if (!movieId) alert("Movie ID not found!");

const API_BASE = "http://127.0.0.1:8000/api/movies/";
const token = localStorage.getItem("accessToken");
const currentUserId = parseInt(localStorage.getItem("userId")); // <-- logged-in user's ID

// Trailer modal
const trailerModal = document.getElementById("trailerModal");
const trailerFrame = document.getElementById("trailerFrame");
const closeTrailerBtn = document.getElementById("closeTrailer");

closeTrailerBtn.onclick = () => {
  trailerFrame.src = "";
  trailerModal.classList.remove("show");
};
trailerModal.onclick = e => {
  if (e.target === trailerModal) {
    trailerFrame.src = "";
    trailerModal.classList.remove("show");
  }
};

// Fetch movie details
async function fetchMovie(id) {
  try {
    const res = await fetch(`${API_BASE}movies/${id}/`, {
      headers: { "Content-Type": "application/json", ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
    });
    if(!res.ok) throw new Error("Failed to load movie");
    return await res.json();
  } catch(err) { console.error(err); alert("Failed to load movie data!"); }
}

// Load reviews
async function loadReviews() {
  try {
    const res = await fetch(`${API_BASE}reviews/?movie_id=${movieId}`, {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });
    const reviews = await res.json();
    const list = document.getElementById("commentsList");
    list.innerHTML = "";

    if (!reviews.length) {
      list.innerHTML = `<li class="no-comments">No reviews yet!</li>`;
      return;
    }

  reviews.forEach(r => {
  const li = document.createElement("li");
  li.className = "comment-item";

  li.innerHTML = `
    <div class="author">${r.user.username}</div>
    <div class="date">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
    <div class="text">${r.comment}</div>
  `;

  // Three dots menu for user's own review
  if (token && r.user.id === parseInt(localStorage.getItem("userId"))) {
    const menuBtn = document.createElement("button");
    menuBtn.className = "menu-btn";
    menuBtn.innerHTML = "⋮";

    const dropdown = document.createElement("div");
    dropdown.className = "menu-dropdown";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = async () => {
      if (!confirm("Delete this review?")) return;
      try {
        const delRes = await fetch(`${API_BASE}reviews/${r.id}/`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!delRes.ok) throw new Error("Delete failed");
        loadReviews();
      } catch (err) {
        console.error(err);
        alert("Failed to delete review");
      }
    };

    dropdown.appendChild(deleteBtn);
    li.appendChild(menuBtn);
    li.appendChild(dropdown);

    // Toggle dropdown on click
    menuBtn.onclick = e => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    };

    // Close dropdown when clicking outside
    document.addEventListener("click", () => { dropdown.style.display = "none"; });
  }

  list.appendChild(li);
});

    // Scroll reviews list if too long
    list.style.maxHeight = "400px";
    list.style.overflowY = "auto";

  } catch (err) {
    console.error(err);
  }
}

// Submit review
document.getElementById("commentForm").addEventListener("submit", async e => {
  e.preventDefault();
  if(!token) return alert("Login required");

  const comment = document.getElementById("commentText").value.trim();
  const rating = parseInt(document.getElementById("commentStars").value);
  if(!comment || !rating) return;

  try {
    const res = await fetch(`${API_BASE}reviews/`, {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization":`Bearer ${token}` },
      body: JSON.stringify({ movie: movieId, comment, rating })
    });
    if(!res.ok) throw new Error("Failed to submit review");
    e.target.reset();
    loadReviews(); // refresh reviews
  } catch(err) { console.error(err); alert("Failed to submit review"); }
});

// Watchlist / Favorite buttons
async function toggleWatchlist() {
  if(!token) return alert("Login required!");
  const res = await fetch(`${API_BASE}watchlist/${movieId}/toggle/`, { method:"POST", headers:{ "Authorization":`Bearer ${token}` } });
  const data = await res.json(); alert(data.detail);
}

async function toggleFavorite() {
  if(!token) return alert("Login required!");
  const res = await fetch(`${API_BASE}favorites/${movieId}/toggle/`, { method:"POST", headers:{ "Authorization":`Bearer ${token}` } });
  const data = await res.json(); alert(data.detail);
}

// Initialize movie details
async function initMovie() {
  currentMovie = await fetchMovie(movieId);
  if(!currentMovie) return;

  document.getElementById("movieHero").style.display = "flex";
  document.getElementById("moviePoster").src = currentMovie.poster || "images/default-poster.jpg";
  document.getElementById("movieTitle").textContent = currentMovie.title;
  document.getElementById("movieRating").textContent = `⭐ ${currentMovie.rating || "N/A"}`;
  document.getElementById("movieDesc").textContent = currentMovie.description;
  document.getElementById("movieDirector").textContent = `Director: ${currentMovie.director || "—"}`;
  document.getElementById("movieCast").textContent = `Cast: ${currentMovie.cast || "—"}`;
  document.getElementById("movieYear").textContent = `Year: ${currentMovie.release_date?.split("-")[0] || "—"}`;

  const genresContainer = document.getElementById("movieGenre");
  genresContainer.innerHTML = "";
  if(currentMovie.genre) currentMovie.genre.split(",").forEach(g => {
    const span = document.createElement("span");
    span.className="genre-tag";
    span.textContent=g.trim();
    genresContainer.appendChild(span);
  });

  // Trailer button
  document.getElementById("trailerBtn").onclick = () => {
    if(currentMovie.trailer_url) {
      trailerFrame.src = currentMovie.trailer_url + "?autoplay=1";
      trailerModal.classList.add("show");
    } else alert("Trailer not available");
  };

  document.getElementById("watchlistBtn").onclick = toggleWatchlist;
  document.getElementById("favoriteBtn").onclick = toggleFavorite;

  loadReviews();
}

initMovie();
