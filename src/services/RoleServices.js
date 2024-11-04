import apiClient from "./services";

export default {
  getRoles() {
    return apiClient.get("roles");
  },
  getRoles(id) {
    return apiClient.get("roles/" + id);
  },
  addRoles(data) {
    return apiClient.post("roles", data);
  },
  updateRoles(data) {
    return apiClient.put("roles/" + data.id, data);
  },
  deleteRoles(id) {
    return apiClient.delete("roles/" + id);
  },
};
