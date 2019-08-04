const express = require("express");

const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, (req, res) =>
  res.send({ message: "Tudo ok no método GET para raiz" })
);

router.post("/", (req, res) =>
  res.send({ message: "Tudo ok no método POST para raiz" })
);

const install = app => app.use("/", router);

module.exports = {
  install
};
