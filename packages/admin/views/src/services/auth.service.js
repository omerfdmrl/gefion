import apiService from "./api.service";
import storageService from "./storage.service";

const login = (data) => {
  return apiService("auth/login", data, {
    updateTokens: false,
  });
};

const logout = async () => {
  var refreshToken = await storageService.get("session");
  refreshToken = refreshToken.refresh.token;
  return apiService("auth/logout", {
    refreshToken,
  });
};

/**
 * 0: refresh access tokens
 * 1: allright
 * -1: no authenticated
 */
const isTokensExpired = async () => {
  const tokens = await storageService.get("session");
  if (!tokens) return -1;
  const now = new Date();
  if (tokens.access && tokens.access.expires) {
    const accessDate = new Date(tokens.access.expires);
    if (now > accessDate) return 0;
  }
  if (tokens.refresh && tokens.refresh.expires) {
    const refreshDate = new Date(tokens.refresh.expires);
    if (now > refreshDate) return -1;
  }
  if (tokens.refresh && tokens.refresh.expires && !tokens.access) {
    return 0;
  }
  return 1;
};

const refreshTokens = async () => {
  var refreshToken = await storageService.get("session");
  refreshToken = refreshToken.refresh.token;
  await apiService(
    "auth/refresh",
    { refreshToken },
    { updateTokens: false }
  ).then(async (value) => {
    if (value.status == 401) return;
    await storageService.set("session", value);
  });
};

const getAccessToken = async () => {
  const tokenStatus = await isTokensExpired();
  const tokens = await storageService.get("session");
  if (!tokens || tokens === "undefined" || tokenStatus !== 1) return false;
  return tokens.access.token;
};

export default {
  login,
  logout,
  refreshTokens,
  isTokensExpired,
  getAccessToken,
};
