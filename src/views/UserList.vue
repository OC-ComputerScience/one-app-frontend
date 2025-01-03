<script setup>
import UserServices from "../services/UserServices";
import RoleServices from "../services/RoleServices";
import Utils from "../config/utils.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const users = ref([]);
const fileredUsers = ref([]);
const roles = ref([]);
const selectedRole = ref(null);
const json_headers = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  roleName: "Role",
};
const json_fields = ["firstName", "lastName", "email", "roleName"];

const message = ref("Update user role");

const updateRole = (user) => {
  user.roleId = user.role.type.id;
  user.roleName = user.role.type.type;
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

const filterUsers = () => {
  if (selectedRole.value) {
    fileredUsers.value = users.value.filter(
      (user) => user.roleId === selectedRole.value
    );
  } else {
    fileredUsers.value = users.value;
  }
};

const retrieveUsers = () => {
  UserServices.getAllUsers()
    .then((response) => {
      users.value = response.data;
      fileredUsers.value = users.value;
      fileredUsers.value.forEach((user) => {
        user.roleName = roles.value.find(
          (role) => role.id === user.roleId
        ).type;
      });
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
retrieveRoles();
retrieveUsers();
</script>

<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title> Users </v-card-title>
        <v-card-text>
          <b>{{ message }}</b>
        </v-card-text>

        <v-card-text>
          <v-select
            v-model="selectedRole"
            :items="roles"
            item-title="type"
            item-value="id"
            label="Select Role"
            dense
            outlined
            clearable
            @update:modelValue="filterUsers"
          ></v-select>

          <download-csv
            :data="fileredUsers"
            name="user-data-oneapp.csv"
            :labels="json_headers"
            :fields="json_fields"
          >
            <v-btn
              variant="outlined"
              elevation="0"
              density="comfortable"
              color="primary"
            >
              Download
            </v-btn>
          </download-csv>
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
            <tr v-for="(user, index) in fileredUsers" :key="user.id">
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
