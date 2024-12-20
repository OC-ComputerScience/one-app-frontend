<script setup>
import UniversityServices from "../services/UniversityServices";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const universitys = ref([]);

const message = ref("Add, Update and Delete Universities");

const updateUniversity = (university) => {
  university.roleId = university.role.type.id;
  console.log(university);
  UniversityServices.updateUniversity(university);
};
const deleteUniversity = (university) => {
  UniversityServices.deleteUniversity(university.id)
    //add deleting all university data
    .then(() => {
      retrieveUniversitys();
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const retrieveUniversities = () => {
  UniversityServices.getAllUniversities()
    .then((response) => {
      universitys.value = response.data;
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

retrieveUniversities();
</script>

<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title> Universitys </v-card-title>
        <v-card-text>
          <b>{{ message }}</b>
        </v-card-text>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Abrev</th>
              <th class="text-left">City</th>
              <th class="text-left">State</th>
              <th class="text-left">URL</th>
              <th class="text-left">Relationship</th>
              <th class="text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(university, index) in universitys" :key="university.id">
              <td>{{ university.name }}</td>
              <td>{{ university.abrev }}</td>
              <td>{{ university.city }}</td>
              <td>{{ university.state }}</td>
              <td>{{ university.url }}</td>
              <td>{{ university.relationship }}</td>
              <td>{{ university.status }}</td>
              <td>
                <v-btn
                  @click="updateUniversity(university)"
                  color="primary"
                  class="mr-4"
                >
                  mdi-pencil
                </v-btn>
                <v-btn
                  @click="deleteUniversity(university)"
                  color="error"
                  class="mr-4"
                >
                  mdi-trash
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </div>
</template>
