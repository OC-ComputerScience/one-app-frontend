import apiClient from "./services";

export default {
  getUser(id) {
    return apiClient.get("user+" + id);
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
};
