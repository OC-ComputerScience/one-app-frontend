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
  phone: "Phone",
  streetAddress: "Street Address",
  city: "City",
  state: "State",
  zip: "Zip",
  congregation: "Congregation",
  howHeard: "How Heard",
  hsgradyear: "HS Grad Year",
  roleName: "Role",
};

const json_fields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "streetAddress",
  "city",
  "state",
  "zip",
  "congregation",
  "howHeard",
  "hsgradyear",
  "roleName",
];
const status = ["active", "inactive"];

const message = ref("Update user role");

const update = (user) => {
  let updatedUser = {};

  updatedUser.typeId = user.role.type.id;
  updatedUser.id = user.id;
  updatedUser.status = user.status;
  user.roleName = user.role.type.type;
  UserServices.updateUser(updatedUser);
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
              <th class="text-left">Status</th>
              <th class="text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in fileredUsers" :key="user.id">
              <td>{{ user.firstName }}</td>
              <td>{{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>
                <v-combobox
                  density="comfortable"
                  v-model="user.status"
                  :items="status"
                  @update:modelValue="update(user)"
                ></v-combobox>
              </td>
              <td>
                <v-combobox
                  density="comfortable"
                  v-model="user.role.type"
                  :items="roles"
                  item-title="type"
                  @update:modelValue="update(user)"
                ></v-combobox>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </div>
</template>
