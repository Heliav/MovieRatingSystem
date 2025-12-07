document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      try {
        // Optionally send logout request to backend to blacklist refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          await fetch("http://127.0.0.1:8000/api/accounts/logout/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify({ refresh: refreshToken })
          });
        }

        // Clear localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // Show message
        alert("You have been logged out successfully.");

        // Redirect to login page
        window.location.href = "login.html";
      } catch (err) {
        console.error(err);
        alert("Logout failed. Please try again.");
      }
    });
  }
});
