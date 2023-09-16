const path = require("path");
const products = require("../database/products.json");
const usuarios = require("../database/users.json");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcryptjs = require("bcryptjs");

const userController = {
  fromLogin: (req, res) => {
    res.render(path.join("users", "login"));
  },

  loginProcess: (req, res) => {
    let userToLogin = User.findByField("email", req.body.email);

    if (userToLogin) {
      let isOkThePassword = bcryptjs.compareSync(
        req.body.password,
        userToLogin.password
      );
      if (isOkThePassword) {
        delete userToLogin.password;
        req.session.userLogged = userToLogin;

        if (req.body.remember_user) {
          res.cookie("userEmail", req.body.email, { maxAge: 1000 * 60 * 60 });
        }

        return res.redirect("/usuario/");
      }
      return (
        path.join("users", "login"),
        {
          errors: {
            email: {
              msg: "Las credenciales son inválidas",
            },
          },
        }
      );
    }

    return (
      path.join("users", "login"),
      {
        errors: {
          email: {
            msg: "No se encuentra este email en nuestra base de database",
          },
        },
      }
    );
  },

  formRegister: (req, res) => {
    res.render(path.join("users", "register"));
  },

  usuario: (req, res) => {
    let id = req.params.id;
    let usuario = usuarios.find((usuario) => {
      return usuario.id == id;
    });
    res.render(path.join("users", "usuario"), { usuario });
  },

  edit: (req, res) => {
    let id = req.params.id;
    let usuario = usuarios.find((usuario) => {
      return usuario.id == id;
    });
    res.render(path.join("users", "edit-user"), { usuario });
  },

  registerProcess: (req, res) => {
    const resultValidation = validationResult(req);

    if (resultValidation.errors.length > 0) {
      return res.render(path.join("users", "register"), {
        errors: resultValidation.mapped(),
        oldData: req.body,
      });
    }

    let userInDB = User.findByField("email", req.body.email);

    if (userInDB) {
      return res.render(path.join("users", "register"), {
        errors: {
          email: {
            msg: "Este email ya está registrado",
          },
        },
        oldData: req.body,
      });
    }

    let userToCreate = {
      ...req.body,
      password: bcryptjs.hashSync(req.body.password, 10),
      imgperfil: req.file.filename,
    };

    let userCreated = User.create(userToCreate);

    return res.redirect("/usuario/login");
  },

  logout: (req, res) => {
    res.clearCookie("userEmail");
    req.session.destroy();
    return res.redirect("/");
  },

  profile: (req, res) => {
    return res.render(path.join("users", "usuario"), {
      user: req.session.userLogged,
    });
  },

  // editUser: (req, res) => {
  //   const {
  //     name,
  //     lastname,
  //     user,
  //     email,
  //     imgperfil,
  //     password,
  //     repeatPassword,
  //     reseñas,
  //     telefono,
  //     ciudad,
  //   } = req.body;

  //   const { id } = req.params;
  //   const usuarioId = usuarios.find((e) => e.id == id);

  //   if (imgperfil) {
  //     usuarioId.imgperfil = imgperfil;
  //   }

  //   let usuarioEditado = {
  //     id: usuarioId.id,
  //     name: name,
  //     lastName: lastname,
  //     user: user,
  //     email: email,
  //     imgperfil: usuarioId.imgperfil,
  //     password: usuarioId.password,
  //     reseñas: reseñas,
  //     telefono: telefono,
  //     ciudad: ciudad,
  //   };

  //   usuarios[id - 1] = usuarioEditado;
  //   fs.writeFileSync(
  //     path.join(__dirname, "..", "database", "users.json"),
  //     JSON.stringify(usuarios, null, 2)
  //   );
  //   res.redirect("/usuario/" + id);
  // },
};

module.exports = userController;
