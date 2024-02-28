const express = require("express");
const { addUser, sendMoney, cashOut } = require("../controlers/userControler");

const Router = express.Router();
Router.post("/",addUser);
Router.patch("/sendMoney",sendMoney)
Router.post("/cashOut",cashOut);

module.exports = Router;