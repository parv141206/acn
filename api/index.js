const express = require("express");
const app = express();
const path = require("path");

// Set the view engine to EJS
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "../views"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));

// Define your routes
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

app.get("/packet", (req, res) => {
  res.render("packet_analysis", { title: "Packet Analysis" });
});

// Export the app for Vercel
module.exports = app;
