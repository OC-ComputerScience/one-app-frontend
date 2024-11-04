import apiClient from "./services";

export default {
  getApplications() {
    return apiClient.get("applications");
  },
  getApplications(id) {
    return apiClient.get("applications/" + id);
  },
  addApplications(data) {
    return apiClient.post("applications", data);
  },
  updateApplications(data) {
    return apiClient.put("applications/" + data.id, data);
  },
  deleteApplications(id) {
    return apiClient.delete("applications/" + id);
  },
};
