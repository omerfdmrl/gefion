import authService from "./auth.service";

const defaultConfig = {
  method: "POST",
  updateTokens: true,
};
export default async (url, credentials, config) => {
  config = { ...defaultConfig, ...config };
  var headers = {
    Accept: "application/json",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Credentials": true,
  };
  if (config.updateTokens) {
    const tokenStatus = await authService.isTokensExpired();
    if (tokenStatus == 0) {
      await authService.refreshTokens();
    }
    const token = await authService.getAccessToken();
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }
  }
  if (!(credentials instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  var apiBody = {
    method: config.method,
    credentials: "omit",
    withCredentials: true,
    xhrFields: { withCredentials: true },
    headers: headers,
  };
  if (config.method != "HEAD" && config.method != "GET")
    apiBody.body =
      credentials instanceof FormData
        ? credentials
        : JSON.stringify(credentials);

  if (config.method == "GET") {
    url += "?" + new URLSearchParams(credentials).toString();
  }

  return fetch("http://127.0.0.1:7021/" + url, apiBody).then(
    async (rawResponse) => {
      if (rawResponse.status === 204) {
        return { success: true };
      } else if (rawResponse.status > 400) {
        const text = await rawResponse.text();
        return Promise.reject(text);
      } else {
        const contentType = rawResponse.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          return rawResponse.json();
        } else {
          return rawResponse.text();
        }
      }
    }
  );
};
