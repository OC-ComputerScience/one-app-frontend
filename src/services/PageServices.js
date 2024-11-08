import apiClient from "./services";

export default {
  getPages() {
    return apiClient.get("pages");
  },
  getPageById(id) {
    return apiClient.get("pages/" + id);
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
