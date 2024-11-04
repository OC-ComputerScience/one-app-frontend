import apiClient from "./services";

export default {
  getFields() {
    return apiClient.get("fields");
  },
  getFields(id) {
    return apiClient.get("fields/" + id);
  },
  addFields(data) {
    return apiClient.post("fields", data);
  },
  updateFields(data) {
    return apiClient.put("fields/" + data.id, data);
  },
  deleteFields(id) {
    return apiClient.delete("fields/" + id);
  },
};
