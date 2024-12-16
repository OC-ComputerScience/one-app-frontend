import apiClient from "./services";

export default {
  getUserUniversities() {
    return apiClient.get("userUniversities");
  },
  getUserUniversities(id) {
    return apiClient.get("userUniversities/" + id);
  },
  addUserUniversities(data) {
    return apiClient.post("userUniversities", data);
  },
  updateUserUniversities(data) {
    return apiClient.put("userUniversities/" + data.id, data);
  },
  deleteUserUniversities(id) {
    return apiClient.delete("userUniversities/" + id);
  },
};
