<script setup>
import UniversityServices from "../services/UniversityServices";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UniversityDiaglog from "../components/UniversityDialog.vue";
const router = useRouter();
const universities = ref([]);

const message = ref("Add, Update and Delete Universities");

const showUnivDialog = ref(false);
const university = ref({});

const editUniversity = (univ) => {
  university.value = univ;
  showUnivDialog.value = true;
};
const deleteUniversity = (univ) => {
  UniversityServices.deleteUniversity(univ.id)
    .then(() => {
      retrieveUniversities();
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};
const closeDialog = () => {
  showUnivDialog.value = false;
};

const addUniversity = () => {
  showUnivDialog.value = true;
  university.value = null;
};

const retrieveUniversities = () => {
  UniversityServices.getAllUniversities()
    .then((response) => {
      universities.value = response.data;
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
        <v-card-title> Universities </v-card-title>
        <v-card-text>
          <b>{{ message }}</b>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" @click="addUniversity">Add University</v-btn>
        </v-card-actions>
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
            <tr
              v-for="(university, index) in universities"
              :key="university.id"
            >
              <td>{{ university.name }}</td>
              <td>{{ university.abrev }}</td>
              <td>{{ university.city }}</td>
              <td>{{ university.state }}</td>
              <td>{{ university.url }}</td>
              <td>{{ university.relationship }}</td>
              <td>{{ university.status }}</td>
              <td>
                <v-icon small class="mx-4" @click="editUniversity(university)">
                  mdi-pencil
                </v-icon>
                <v-icon
                  small
                  class="mx-4"
                  @click="deleteUniversity(university)"
                >
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </div>
  <v-dialog v-model="showUnivDialog" max-width="600px">
    <UniversityDiaglog
      :universityData="university"
      @close-dialog="closeDialog"
      @updateList="retrieveUniversities"
    />
  </v-dialog>
</template>
