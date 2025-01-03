<script setup>
import FormServices from "../services/FormServices";
import { ref } from "vue";
import { useRouter } from "vue-router";
import FormDiaglog from "../components/FormDialog.vue";
import ExportDiaglog from "../components/ExportDialog.vue";

const router = useRouter();
const forms = ref([]);

const message = ref("Add, Update, Edit Form Pages and Delete Forms");

const showFormDialog = ref(false);
const showExportDialog = ref(false);
const form = ref({});

const editForm = (formx) => {
  form.value = formx;
  showFormDialog.value = true;
};
const editFormPages = (formx) => {
  router.push({ name: "editForm", params: { formId: formx.id } });
};
const deleteForm = (form) => {
  FormServices.deleteForm(form.id)
    .then(() => {
      retrieveForms();
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};
const closeDialog = () => {
  showFormDialog.value = false;
};

const closeExportDialog = () => {
  showExportDialog.value = false;
};

const addForm = () => {
  showFormDialog.value = true;
  form.value = null;
};

const exportForm = (formx) => {
  form.value = formx;
  showExportDialog.value = true;
};

const retrieveForms = () => {
  FormServices.getAllForms()
    .then((response) => {
      forms.value = response.data;
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

retrieveForms();
</script>

<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title> Forms </v-card-title>
        <v-card-text>
          <b>{{ message }}</b>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" @click="addForm">Add Form</v-btn>
        </v-card-actions>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Status</th>
              <th class="text-left">MainForm</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(form, index) in forms" :key="form.id">
              <td>{{ form.name }}</td>
              <td>{{ form.status }}</td>
              <td>{{ form.mainForm }}</td>

              <td>
                <v-icon small class="mx-4" @click="editForm(form)">
                  mdi-pencil
                </v-icon>
                <v-icon small class="mx-4" @click="editFormPages(form)">
                  mdi-table
                </v-icon>
                <v-icon small class="mx-4" @click="exportForm(form)">
                  mdi-file-download
                </v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </div>
  <v-dialog v-model="showFormDialog" max-width="600px">
    <FormDiaglog
      :formData="form"
      @close-dialog="closeDialog"
      @updateList="retrieveForms"
    />
  </v-dialog>
  <v-dialog v-model="showExportDialog" max-width="600px">
    <ExportDiaglog :formData="form" @close-export-dialog="closeExportDialog" />
  </v-dialog>
</template>
