import apiClient from "./services";

export default {
  getFieldValues() {
    return apiClient.get("fieldValues");
  },
  getFieldValues(id) {
    return apiClient.get("fieldValues/" + id);
  },
  addFieldValues(data) {
    return apiClient.post("fieldValues", data);
  },
  updateFieldValues(data) {
    return apiClient.put("fieldValues/" + data.id, data);
  },
  deleteFieldValues(id) {
    return apiClient.delete("fieldValues/" + id);
  },
};
