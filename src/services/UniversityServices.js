import apiClient from "./services";

export default {
  getAllUniversities() {
    return apiClient.get("universities");
  },
  getUniversity(id) {
    return apiClient.get("universities/" + id);
  },
  addUniversity(data) {
    return apiClient.post("universities", data);
  },
  updateUniversity(data) {
    return apiClient.put("universities/" + data.id, data);
  },
  deleteUniversity(id) {
    return apiClient.delete("universities/" + id);
  },
};
