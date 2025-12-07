document.addEventListener('DOMContentLoaded', async function () {
  const userMenu = document.getElementById("userMenu");
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");

  // Check login status from JWT access token
  const accessToken = localStorage.getItem("accessToken");
  let username = "";

  if (accessToken) {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/profile/", {
        headers: { "Authorization": `Bearer ${accessToken}` }
      });

      if (res.ok) {
        const data = await res.json();
        username = data.username;

        if (userMenu) {
          userMenu.style.display = "block";
          const profileLink = userMenu.querySelector("a");
          if (profileLink) profileLink.textContent = username + " ▾";
        }

        if (loginLink) loginLink.style.display = "none";
        if (signupLink) signupLink.style.display = "none";
      } else {
        // Token invalid or expired
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  } else {
    if (userMenu) userMenu.style.display = "none";
    if (loginLink) loginLink.style.display = "block";
    if (signupLink) signupLink.style.display = "block";
  }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const refreshToken = localStorage.getItem("refreshToken");

      // Call backend to blacklist refresh token
      if (refreshToken) {
        await fetch("http://127.0.0.1:8000/api/accounts/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
          body: JSON.stringify({ refresh: refreshToken })
        });
      }

      // Clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Redirect to homepage
      window.location.href = "index.html";
    });
  }
});
