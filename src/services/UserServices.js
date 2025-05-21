import apiClient from "./services";

export default {
  getUser(id) {
    return apiClient.get("users/" + id);
  },

  getAllUsers() {
    return apiClient.get("users");
  },
  addUser(user) {
    return apiClient.post("users", user);
  },
  updateUser(user) {
    return apiClient.put("users/"+user.id, user);
  },
  loginUser(user) {
    return apiClient.post("login", user, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        crossDomain: true,
        Authorization:
          "Basic " + btoa(user.email + ":" + user.password),
      },
    });
  },
  logoutUser() {
    return apiClient.post("logout");
  },
  requestPasswordReset(email) {
    return apiClient.post("users/password/reset-request", { email });
  },
  resetPassword(token, newPassword) {
    return apiClient.post("users/password/reset", { token, newPassword });
  },
  updateLastDownloadDate(userId, date) {
    return apiClient.put(`users/${userId}/last-download`, { date });
  },
};
