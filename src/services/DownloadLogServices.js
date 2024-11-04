import apiClient from "./services";

export default {
  getDownloadLogs() {
    return apiClient.get("downloadLogs");
  },
  getDownloadLogs(id) {
    return apiClient.get("downloadLogs/" + id);
  },
  addDownloadLogs(data) {
    return apiClient.post("downloadLogs", data);
  },
  updateDownloadLogs(data) {
    return apiClient.put("downloadLogs/" + data.id, data);
  },
  deleteDownloadLogs(id) {
    return apiClient.delete("downloadLogs/" + id);
  },
};
