const express = require("express");
const router = express.Router();

//controller
const userController = require("../controllers/userController");

//middlewares
const uploadFile = require("../middlewares/multerConfigUser");
const validations = require("../middlewares/validarRegistro");
const controller = require("../controllers/userController");
const redirectIfAutenticated = require("../middlewares/redirectIfAutenticated");
const authMiddleware = require("../middlewares/authMiddleware");
const userValidationsLogin = require("../middlewares/userValidationsLogin");

// Formulario de login
router.get("/login", redirectIfAutenticated, userController.fromLogin);
// Procesar el login
router.post("/login", userController.loginProcess);

// Formulario de registro
router.get("/register", redirectIfAutenticated, userController.formRegister);
// Procesar el registro
router.post(
  "/register",
  uploadFile.single("imgperfil"),
  userValidationsLogin,
  validations,
  userController.registerProcess
);

// Perfil de Usuario
router.get("/profile/", authMiddleware, userController.profile);

// Logout
router.get("/logout/", userController.logout);
//router.post("/edit/:id", upload.single("imgperfil"), userController.editUser);

module.exports = router;
