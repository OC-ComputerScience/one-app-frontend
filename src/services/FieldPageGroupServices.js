import apiClient from "./services";

export default {
  getFieldPageGroups() {
    return apiClient.get("fieldPageGroups");
  },
  getFieldPageGroups(id) {
    return apiClient.get("fieldPageGroups/" + id);
  },
  addFieldPageGroups(data) {
    return apiClient.post("fieldPageGroups", data);
  },
  updateFieldPageGroups(data) {
    return apiClient.put("fieldPageGroups/" + data.id, data);
  },
  deleteFieldPageGroups(id) {
    return apiClient.delete("fieldPageGroups/" + id);
  },
};
