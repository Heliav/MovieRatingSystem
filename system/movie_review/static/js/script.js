document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("movie-list");

    fetch("/api/movies/")  // Adjust if your endpoint is different
        .then(response => response.json())
        .then(data => {
            data.forEach(movie => {
                const card = document.createElement("div");
                card.className = "movie-card";
                card.innerHTML = `
                    <h2>${movie.name}</h2>
                    <p><strong>Director:</strong> ${movie.director}</p>
                    <p><strong>Cast:</strong> ${movie.cast}</p>
                    <p><strong>Release:</strong> ${movie.release_date}</p>
                    <p><strong>Rating:</strong> ${movie.rating}</p>
                    <p>${movie.description || ''}</p>
                `;
                container.appendChild(card);
            });
        })
        .catch(err => {
            container.innerHTML = `<p>Could not load movies 😢</p>`;
            console.error("Error loading movies:", err);
        });
});
