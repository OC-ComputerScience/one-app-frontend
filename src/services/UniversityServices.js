import apiClient from "./services";

export default {
  getUniversities() {
    return apiClient.get("universities");
  },
  getUniversities(id) {
    return apiClient.get("universities/" + id);
  },
  addUniversities(data) {
    return apiClient.post("universities", data);
  },
  updateUniversities(data) {
    return apiClient.put("universities/" + data.id, data);
  },
  deleteUniversities(id) {
    return apiClient.delete("universities/" + id);
  },
};
