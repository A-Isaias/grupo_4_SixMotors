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

app.get("/productDetail", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/productDetail.html"));
});
app.get("/carrito", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/carrito.html"));
});

app.get("/nav", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./views/nav.html"));
});


