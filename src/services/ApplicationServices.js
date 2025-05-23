import apiClient from "./services";

export default {
  getApplications() {
    return apiClient.get("applications");
  },

  getApplications(appId) {
    return apiClient.get("applications/" + appId);
  },
  getApplicationsForFormSinceDate(formId, date) {
    return apiClient.get("applications/form/" + formId + "/date/" + date);
  },
  getApplicationsByUserId(id) {
    return apiClient.get("applications/user/" + id);
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
