const { body, validationResult } = require("express-validator");
const dataBase = require("../datos/users.json");
const path = require("path");
const fs = require("fs");
const { hashSync } = require("bcryptjs");

const pathFile = path.join(__dirname, "..", "datos", "users.json");

const validacionesRegistro = [
  body("name")
    .notEmpty()
    .withMessage("Debes ingresar un nombre")
    .withMessage("Debe al menos 5 carácteres"),
  body("lastname").notEmpty().withMessage("Debes ingresar un apellido"),
  body("user").notEmpty().withMessage("Debes ingresar un usuario"),
  body("email")
    .notEmpty()
    .withMessage("Debes ingresar un email")
    .bail()
    .isEmail()
    .withMessage("Debe ingresar un formato válido"),
  body("password").notEmpty().withMessage("Debes ingresar un password"),
  body("rePassword").notEmpty().withMessage("Debes ingresar un password"),
  //body("imgperfil").notEmpty().withMessage("Debes ingresar una imagen"),
];

const resultadoValidacion = (req, res, next) => {
  const errors = validationResult(req);

  console.log(req.body);

  if (errors.isEmpty() === true) {
    // FALSE: hay errores | TRUE: No hay errores
    // TRUE
    const newUser = {
      id: `${dataBase.length + 1}`,
      ...req.body,
      password: hashSync(req.body.password, 10),
      imgperfil: req.file.filename, // Agrega el nombre del archivo cargado
    };

    delete newUser.rePassword;

    dataBase.push(newUser);

    fs.writeFileSync(pathFile, JSON.stringify(dataBase));
    console.log("Usuario registrado");
    next();
  } else {
    console.log("Hay errores");
    res.render("users/register", {
      errors: errors.mapped(),
      old: req.body,
    });
    console.log(errors.mapped());
    console.log(req.body);
    console.log(req.file);
  }
};

module.exports = {
  validacionesRegistro,
  resultadoValidacion,
};
