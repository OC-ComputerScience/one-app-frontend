import apiClient from "./services";

export default {
  getAllForms() {
    return apiClient.get("forms");
  },
  getForm(id) {
    return apiClient.get("forms/" + id);
  },
  getMainForm() {
    return apiClient.get("forms/main");
  },
  addForm(data) {
    return apiClient.post("forms", data);
  },
  updateForm(data) {
    return apiClient.put("forms/" + data.id, data);
  },
  deleteForm(id) {
    return apiClient.delete("forms/" + id);
  },
};
