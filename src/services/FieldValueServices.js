import apiClient from "./services";

export default {
  getFieldValues() {
    return apiClient.get("fieldValues");
  },
  getFieldValues(id) {
    return apiClient.get("fieldValues/" + id);
  },
  getFieldValuesByField(fieldId) {
    return apiClient.get("fieldValues/field/" + fieldId);
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
