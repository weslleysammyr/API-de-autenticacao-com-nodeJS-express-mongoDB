const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const request = require("supertest");

const Users = require("../../model/user");
const usersRouter = require("../users");

const initApp = () => {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  usersRouter.install(app);
  return app;
};

const app = initApp();

const usersMock = [
  {
    login: "login",
    username: "username",
    password: "password"
  },
  {
    login: "login",
    username: "username",
    password: "password"
  }
];

const userResponseBody = {
  user: { login: "login", username: "username" },
  token: "mockToken"
};

const authMock = {
  login: "login",
  password: "password"
};

describe("users", () => {
  describe("GET /users", () => {
    it("Should list all users", async () => {
      Users.find = jest.fn(() => usersMock);
      const response = await request(app).get("/users");
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(usersMock);
    });

    it("Should throws an error", async () => {
      Users.find = jest.fn(() => {
        throw new Error();
      });
      const response = await request(app).get("/users");
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ error: "Erro na consulta de usuários!" });
    });
  });

  describe("POST /users/create", () => {
    it("Should returns status code 200 with user and token infos", async () => {
      Users.findOne = jest.fn(() => false);
      Users.create = jest.fn(obj => obj);
      jwt.sign = jest.fn(() => "mockToken");
      const body = Object.assign({}, usersMock[0]);
      const response = await request(app)
        .post("/users/create")
        .send(body);
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(userResponseBody);
    });

    it("Should returns status code 400 when username isnt fullfilled", async () => {
      Users.findOne = jest.fn(() => false);
      Users.create = jest.fn(obj => obj);
      jwt.sign = jest.fn(() => "mockToken");
      const body = Object.assign({}, usersMock[0]);
      body.username = undefined;
      const response = await request(app)
        .post("/users/create")
        .send(body);
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: "Dados insuficientes!" });
    });

    it("Should returns status code 400 when password isnt fullfilled", async () => {
      Users.findOne = jest.fn(() => false);
      Users.create = jest.fn(obj => obj);
      jwt.sign = jest.fn(() => "mockToken");
      const body = Object.assign({}, usersMock[0]);
      body.password = undefined;
      const response = await request(app)
        .post("/users/create")
        .send(body);
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: "Dados insuficientes!" });
    });

    it("Should returns status code 400 when login isnt fullfilled", async () => {
      Users.findOne = jest.fn(() => false);
      Users.create = jest.fn(obj => obj);
      jwt.sign = jest.fn(() => "mockToken");
      const body = Object.assign({}, usersMock[0]);
      body.login = undefined;
      const response = await request(app)
        .post("/users/create")
        .send(body);
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: "Dados insuficientes!" });
    });

    it("Should returns status code 400 when login already exists", async () => {
      Users.findOne = jest.fn(() => true);
      Users.create = jest.fn(obj => obj);
      jwt.sign = jest.fn(() => "mockToken");
      const body = Object.assign({}, usersMock[0]);
      const response = await request(app)
        .post("/users/create")
        .send(body);
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: "Usuário já registrado!" });
    });

    it("Should throws an error and return status code 500", async () => {
      Users.findOne = jest.fn(() => false);
      Users.create = jest.fn(obj => {
        throw new Error();
      });
      jwt.sign = jest.fn(() => "mockToken");
      const body = Object.assign({}, usersMock[0]);
      const response = await request(app)
        .post("/users/create")
        .send(body);
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ error: "Erro ao criar usuário!" });
    });
  });

  describe("POST /users/auth", () => {
    it("Should returns status code 400 when login isnt fullfilled", async () => {
      const body = Object.assign({}, authMock);
      body.login = undefined;
      const response = await request(app)
        .post("/users/auth")
        .send(body);
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: "Dados insuficientes!" });
    });

    it("Should returns status code 400 when password isnt fullfilled", async () => {
      const body = Object.assign({}, authMock);
      body.password = undefined;
      const response = await request(app)
        .post("/users/auth")
        .send(body);
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: "Dados insuficientes!" });
    });

    it("Should returns status code 400 when user doesnt exists", async () => {
      Users.findOne = jest.fn(() => ({
        select: () => undefined
      }));
      const body = Object.assign({}, authMock);
      const response = await request(app)
        .post("/users/auth")
        .send(body);
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: "Usuário não registrado!" });
    });

    it("Should returns status code 401 when password is wrong", async () => {
      bcrypt.compare = jest.fn(() => false);
      Users.findOne = jest.fn(() => ({
        select: () => ({
          login: "login",
          username: "username",
          password: "password"
        })
      }));
      const body = Object.assign({}, authMock);
      const response = await request(app)
        .post("/users/auth")
        .send(body);
      expect(response.status).toEqual(401);
      expect(response.body).toEqual({ error: "Erro ao autenticar usuário!" });
    });

    it("Should returns status code 500 when an error occurs", async () => {
      Users.findOne = jest.fn(() => {
        throw new Error();
      });
      const body = Object.assign({}, authMock);
      const response = await request(app)
        .post("/users/auth")
        .send(body);
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ error: "Erro ao buscar usuário!" });
    });

    it("Should returns status code 200 with user and token infos", async () => {
      bcrypt.compare = jest.fn(() => true);
      jwt.sign = jest.fn(() => "mockToken");
      Users.findOne = jest.fn(() => ({
        select: () => ({
          login: "login",
          username: "username",
          password: "password"
        })
      }));
      const body = Object.assign({}, authMock);
      const response = await request(app)
        .post("/users/auth")
        .send(body);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(userResponseBody);
    });
  });
});
