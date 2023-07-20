const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const puerto = 3000;

app.listen(puerto, () => {
  console.log("Aplicación corriendo en el puerto 3000");
});

app.use(express.json());
app.use("/", express.static(__dirname + "/public"));
app.use("/", express.static(__dirname + "/design"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.get("/Nav-Footer.html", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./views/Nav-Footer.html"));
});

app.get("/detalles.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/detalles.html"));
});

app.get("/footer.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/footer.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/register.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/login.html"));
});
