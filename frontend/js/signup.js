document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".auth-form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const bio = document.getElementById("bio") ? document.getElementById("bio").value.trim() : "";

    if (!username || !email || !password) {
      return alert("Please fill in all required fields.");
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, bio })
      });

      const data = await res.json();

      if (res.ok) {
        // Save JWT tokens
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        // Save user info
        localStorage.setItem("user", JSON.stringify(data.user));

        // Success message
        alert(`Signup successful! Welcome, ${data.user.username}`);

        // Redirect to profile page
        window.location.href = "profile.html";
      } else {
        // Handle errors from backend
        let message = "";
        for (const key in data) {
          message += `${key}: ${data[key]}\n`;
        }
        alert(`Signup failed:\n${message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again later.");
    }
  });
});
