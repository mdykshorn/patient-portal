const express = require("express");
const loginRouter = express.Router();

const login = require("./../controllers/login");

loginRouter.route("/").get(login.users);
loginRouter.route("/login").post(login.login);
loginRouter.route("/register").post(login.register);
loginRouter.route("/logout").get(login.logout);

module.exports = loginRouter;
