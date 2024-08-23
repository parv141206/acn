const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("home", { title: "lol" });
});

app.get("/packet", (req, res) => {
  res.render("packet_analysis", { title: "lol" });
});
app.listen(8080, () => {
  console.log("App started on http://localhost:8080/");
});
