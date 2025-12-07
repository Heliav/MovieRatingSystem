document.addEventListener("DOMContentLoaded", async () => {
  const accessToken = localStorage.getItem("accessToken");

  const usernameEl = document.getElementById("username");
  const avatarEl = document.querySelector(".avatar");
  const editBtn = document.getElementById("edit-username-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const modal = document.getElementById("edit-profile-modal");
  const closeBtn = modal.querySelector(".close");
  const cancelBtn = modal.querySelector(".cancel-btn");
  const form = document.getElementById("edit-profile-form");
  const editNameInput = document.getElementById("edit-name");
  const editBioInput = document.getElementById("edit-bio");
  const avatarUploadInput = document.getElementById("avatar-upload");

  const moviesWatchedEl = document.getElementById("movies-watched");
  const favoritesCountEl = document.getElementById("favorites-count");
  const reviewsCountEl = document.getElementById("reviews-count");

  async function fetchJSON(url) {
    if (!accessToken) return null;
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async function loadProfile() {
    if (!accessToken) return;

    try {
      const profile = await fetchJSON("http://127.0.0.1:8000/api/accounts/profile/");
      if (!profile) throw new Error("Profile not found");

      usernameEl.textContent = profile.username || "MovieFan123";
      editNameInput.value = profile.username || "MovieFan123";
      editBioInput.value = profile.bio || "Just a movie lover!";
      avatarEl.src = profile.avatar || "images/test1.jpg";

      moviesWatchedEl.textContent = profile.watchlist_count || 5;
      favoritesCountEl.textContent = profile.favorites_count || 3;
      reviewsCountEl.textContent = profile.reviews_count || 2;
    } catch (err) {
      console.log("Using default hardcoded data", err);
    }
  }

  await loadProfile();

  // Modal open/close
  editBtn.onclick = () => modal.classList.remove("hidden");
  const closeModal = () => modal.classList.add("hidden");
  closeBtn.onclick = closeModal;
  cancelBtn.onclick = closeModal;
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Update profile
  form.onsubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) return;

    const fd = new FormData();
    fd.append("username", editNameInput.value.trim());
    fd.append("bio", editBioInput.value.trim());
    if (avatarUploadInput.files[0]) fd.append("avatar", avatarUploadInput.files[0]);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/profile/", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: fd
      });
      if (!res.ok) throw new Error();

      const updated = await res.json();
      usernameEl.textContent = updated.username;
      avatarEl.src = updated.avatar || avatarEl.src;
      closeModal();
      alert("Profile updated!");
    } catch {
      alert("Profile update failed.");
    }
  };

  logoutBtn.onclick = () => {
    localStorage.clear();
    window.location.href = "login.html";
  };

  document.getElementById("clear-data-btn").onclick = () => {
    localStorage.clear();
    alert("Local data cleared!");
  };
});
