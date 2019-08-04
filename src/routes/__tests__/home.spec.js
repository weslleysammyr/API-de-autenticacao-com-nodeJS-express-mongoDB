jest.mock("../../middlewares/auth");

const express = require("express");
const request = require("supertest");

const auth = require("../../middlewares/auth");
const homeRouter = require("../home");

auth.mockImplementation((req, res, next) => next());

const initApp = () => {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  homeRouter.install(app);
  return app;
};

describe("home", () => {
  describe("GET /", () => {
    it("Should returns a message when everything is ok", async () => {
      const app = initApp();
      const response = await request(app).get("/");
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        message: "Tudo ok no método GET para raiz"
      });
    });
  });

  describe("POST /", () => {
    it("Should returns a message when everything is ok", async () => {
      const app = initApp();
      const response = await request(app).post("/");
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        message: "Tudo ok no método POST para raiz"
      });
    });
  });
});
