import apiService from "./api.service";

const getAdminData = () => {
  return apiService(
    "admin/get-admin-data",
    {},
    {
      method: "GET",
    }
  );
};

const getSettings = () => {
  return apiService(
    "admin/get-settings",
    {},
    {
      method: "GET",
    }
  );
};

const saveSettings = (data) => {
  return apiService("admin/save-settings", data);
};

const getPage = (path) => {
  return apiService("admin/get-page", { path });
};

const doPageAction = (path, key, data) => {
  return apiService("admin/do-page-action", { path, key, data });
};

const uploadFile = (file) => {
  return apiService("admin/upload-file", file);
};

export default {
  getAdminData,
  getSettings,
  getPage,
  doPageAction,
  saveSettings,
  uploadFile,
};
