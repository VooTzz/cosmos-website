const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const path = require("path");
require("dotenv").config();

const allowedUsers = ["pinzzzy", "VooTzz"]; // Ganti dengan username GitHub yang kamu izinkan

const app = express();

// Session setup
app.use(session({
  secret: "rahasia-super-aman",
  resave: false,
  saveUninitialized: true
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
}, function(accessToken, refreshToken, profile, done) {
  if (allowedUsers.includes(profile.username)) {
    return done(null, profile);
  } else {
    return done(null, false);
  }
}));

// Serve static HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, "dashboard.html"));
  } else {
    res.redirect("/");
  }
});

app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/unauthorized" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

app.get("/unauthorized", (req, res) => {
  res.send(`
    <h2>Akun Anda tidak diizinkan ❌</h2>
    <a href="/">Kembali ke login</a>
  `);
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
