const home = require("../home");
const index = require("../");
const users = require("../users");

describe("index", () => {
  it("Should install app in routes modules", () => {
    home.install = jest.fn();
    users.install = jest.fn();
    index.install({});
    expect(home.install).toHaveBeenCalled();
    expect(users.install).toHaveBeenCalled();
  });
});
