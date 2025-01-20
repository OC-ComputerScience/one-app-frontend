import apiClient from "./services";

export default {
  getAppFieldValues() {
    return apiClient.get("appFieldValues");
  },
  getAppFieldValues(id) {
    return apiClient.get("appFieldValues/" + id);
  },
  addAppFieldValues(data) {
    return apiClient.post("appFieldValues", data);
  },
  updateAppFieldValues(data) {
    return apiClient.put("appFieldValues/" + data.id, data);
  },
  deleteAppFieldValues(id) {
    return apiClient.delete("appFieldValues/" + id);
  },
  deleteAppFieldValuesForAppSet(fieldId, applicationId, setNumber) {
    return apiClient.delete("appFieldValues/"+fieldId+"/app/"+applicationId+"/set/"+setNumber);
  },
};
