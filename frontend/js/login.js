document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".auth-form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      return alert("⚠️ Please enter valid credentials");
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // Save JWT tokens
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        // Save user info
        localStorage.setItem("user", JSON.stringify(data.user));

        // Success message
        alert(`✅ Welcome back, ${data.user.username}!`);

        // Redirect
        window.location.href = "index.html";
      } else {
        // Show specific errors if present
        const errorMsg = data.error || data.detail || "Login failed. Please try again.";
        alert(`❌ ${errorMsg}`);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Network error: Cannot connect to backend");
    }
  });
});
