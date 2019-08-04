const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");

const Users = require("../model/user");

const router = express.Router();

//Funções auxiliares
const createUserToken = userId =>
  jwt.sign({ id: userId }, process.env.JWT_PASS, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

router.get("/", async (req, res) => {
  try {
    const users = await Users.find({});
    return res.status(200).send(users);
  } catch (err) {
    return res.status(500).send({ error: "Erro na consulta de usuários!" });
  }
});

router.post("/create", async (req, res) => {
  const { username, login, password } = req.body;
  if (!username || !password || !login)
    return res.status(400).send({ error: "Dados insuficientes!" });
  try {
    if (await Users.findOne({ login }))
      return res.status(400).send({ error: "Usuário já registrado!" });
    const user = await Users.create(req.body);
    user.password = undefined;
    return res.status(201).send({ user, token: createUserToken(user.id) });
  } catch (err) {
    return res.status(500).send({ error: "Erro ao criar usuário!" });
  }
});

router.post("/auth", async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password)
    return res.status(400).send({ error: "Dados insuficientes!" });
  try {
    const user = await Users.findOne({ login }).select("+password");
    if (!user)
      return res.status(400).send({ error: "Usuário não registrado!" });

    const pass_ok = await bcrypt.compare(password, user.password);
    if (!pass_ok)
      return res.status(401).send({ error: "Erro ao autenticar usuário!" });
    user.password = undefined;
    const response = {
      user,
      token: createUserToken(user.id)
    };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: "Erro ao buscar usuário!" });
  }
});

const install = app => app.use("/users", router);

module.exports = {
  install
};
