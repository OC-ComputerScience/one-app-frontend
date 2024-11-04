import apiClient from "./services";

export default {
  getPageGroups() {
    return apiClient.get("pageGroups");
  },
  getPageGroups(id) {
    return apiClient.get("pageGroups/" + id);
  },
  addPageGroups(data) {
    return apiClient.post("pageGroups", data);
  },
  updatePageGroups(data) {
    return apiClient.put("pageGroups/" + data.id, data);
  },
  deletePageGroups(id) {
    return apiClient.delete("pageGroups/" + id);
  },
};
