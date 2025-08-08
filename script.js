document.addEventListener("DOMContentLoaded", function () {
  // Simpan user default jika belum ada
  const defaultUser = { username: "user", password: "1234" };
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([defaultUser]));
  }

  // === LOGIN ===
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const message = document.getElementById("login-message");

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        message.style.color = "green";
        message.innerText = "Login berhasil...";
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } else {
        message.style.color = "red";
        message.innerText = "Username atau password salah!";
      }
    });
  }

  // === Proteksi Dashboard ===
  const currentPage = window.location.pathname;
  if (currentPage.includes("dashboard.html")) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      alert("Anda harus login terlebih dahulu!");
      window.location.href = "index.html";
    } else {
      // Tampilkan nama pengguna di dashboard
      const userDisplay = document.getElementById("user-display");
      if (userDisplay) userDisplay.innerText = user.username;
    }

    // Tombol logout
    window.logout = function () {
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    };
  }
});
