const bcrypt = require("bcrypt");
const mockingoose = require("mockingoose").default;

const User = require("../../model/user");

const userMock = {
  username: "username",
  login: "login",
  password: "password"
};

describe("user", () => {
  it("Should validate a user before it's created", async () => {
    mockingoose(User).toReturn(userMock, "save");
    bcrypt.hash = jest.fn(() => "fakeHash");
    const user = new User(userMock);
    await User.create(user);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(user.password).toEqual("fakeHash");
  });

  it("Should validate a user before it's created", async () => {
    mockingoose(User).toReturn(userMock, "save");
    const user = new User(userMock);
    user.isModified = jest.fn(() => false);
    await User.create(user);
    expect(user.password).toEqual("password");
  });
});
