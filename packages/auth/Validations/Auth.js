const Config = require("@gefion/config");

module.exports = {
  login: {
    body: {
      email: "required|string|email",
      password: "required|string",
    },
  },

  logout: {
    body: {
      refreshToken: "required|string",
    },
  },

  register: {
    body: {
      email: "required|string|email",
      password: "required|string",
      name: "required|string|min:4",
    },
  },

  forgot: {
    body: {
      email: "required|string|email",
    },
  },

  reset: {
    query: {
      token: "required|string",
    },
    body: {
      password: "required|string",
    },
  },

  refresh: {
    body: {
      refreshToken: "required|string",
    },
  },

  verify: {
    query: {
      token: "required|string",
    },
  },
};
