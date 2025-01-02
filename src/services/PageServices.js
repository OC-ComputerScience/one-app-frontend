import apiClient from "./services";

export default {
  getPages(formId) {
    return apiClient.get("pages/form/" + formId);
  },
  getPageById(id) {
    return apiClient.get("pages/" + id);
  },
  getPagesByUserId(id,formId) {
    return apiClient.get("pages/user/" + id+"/form/"+formId);
  },
  addPages(data) {
    return apiClient.post("pages", data);
  },
  updatePages(data) {
    return apiClient.put("pages/" + data.id, data);
  },
  deletePages(id) {
    return apiClient.delete("pages/" + id);
  },
};
