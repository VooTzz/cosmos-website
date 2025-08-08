const express = require("express");
const session = require("express-session");
const path = require("path");
const users = require("./database"); // Ambil dari file database.js

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "rahasia_super_aman",
  resave: false,
  saveUninitialized: true
}));

// Serve file HTML (login, dashboard, dll)
app.use(express.static(path.join(__dirname, "public")));

// Routing utama
app.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard.html");
  }
  res.redirect("/login.html");
});

// Proses Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = user;
    return res.redirect("/dashboard.html");
  }

  res.send("Login gagal. <a href='/login.html'>Coba lagi</a>");
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
