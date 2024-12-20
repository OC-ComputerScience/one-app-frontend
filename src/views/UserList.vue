<script setup>
import UserServices from "../services/UserServices";
import RoleServices from "../services/RoleServices";
import Utils from "../config/utils.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const users = ref([]);
const roles = ref([]);

const message = ref("Update user role");

const updateRole = (user) => {
  user.roleId = user.role.type.id;
  console.log(user);
  UserServices.updateUser(user);
};

const deleteUser = (user) => {
  UserServices.delete(user.id)
    //add deleting all user data
    .then(() => {
      retrieveUsers();
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const retrieveUsers = () => {
  UserServices.getAllUsers()
    .then((response) => {
      users.value = response.data;
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const retrieveRoles = () => {
  RoleServices.getAllRoles()
    .then((response) => {
      roles.value = response.data;
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

retrieveUsers();
retrieveRoles();
</script>

<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title> Users </v-card-title>
        <v-card-text>
          <b>{{ message }}</b>
        </v-card-text>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">First Name</th>
              <th class="text-left">Last Name</th>
              <th class="text-left">Email</th>
              <th class="text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.id">
              <td>{{ user.firstName }}</td>
              <td>{{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <v-combobox
                density="comfortable"
                v-model="user.role.type"
                :items="roles"
                item-title="type"
                @update:modelValue="updateRole(user)"
              ></v-combobox>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </div>
</template>
