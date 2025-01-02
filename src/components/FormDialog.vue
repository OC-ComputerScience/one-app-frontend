<script setup>
import { ref, computed } from "vue";
import FormServices from "../services/FormServices";
import { defineProps, defineEmits } from "vue";

const emit = defineEmits(["updateList", "closeDialog"]);
const props = defineProps(["formData"]);

var action = "";
const form = ref({});

if (props.formData == null) {
  form.value = { name: "", status: "Inactive", mainForm: "false" };
  action = "Add";
} else {
  form.value = JSON.parse(JSON.stringify(props.formData));
  action = "Update";
}

const validForm = ref(false);

const statuses = ["Active", "Inactive"];

const errorMessage = ref("");
const rules = {
  required: (value) => !!value || "Required.",
};

const saveForm = () => {
  if (action === "Update") {
    updateForm(form.value);
  } else {
    addForm(form.value);
  }
};

const updateForm = (form) => {
  FormServices.updateForm(form)
    .then(() => {
      emit("updateList");
      closeDialog();
    })
    .catch((e) => {
      errorMessage.value = e.response.data.message;
    });
};
const addForm = (form) => {
  FormServices.addForm(form)
    .then(() => {
      emit("updateList");
      closeDialog();
    })
    .catch((e) => {
      errorMessage.value = e.response.data.message;
    });
};

const closeDialog = () => {
  emit("closeDialog");
};
</script>

<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title>{{ action }} Form</v-card-title>
        <v-card-text class="mt-2 mb-n4">
          <v-form v-model="validForm">
            <v-text-field
              v-model="form.name"
              label="Name"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
            />
            <v-combobox
              v-model="form.status"
              :items="statuses"
              label="Status"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
            ></v-combobox>
            <v-checkbox
              v-model="form.mainForm"
              label="Main Form"
              variant="outlined"
            >
            </v-checkbox>
          </v-form>
        </v-card-text>

        <v-card-text align="center" class="text-red"
          >{{ errorMessage }}
        </v-card-text>

        <v-card-actions align="right" class="mr-2 mb-2">
          <v-btn
            variant="plain"
            elevation="0"
            density="comfortable"
            @click="closeDialog"
            color="accent"
          >
            Cancel
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn
            variant="outlined"
            elevation="0"
            density="comfortable"
            @click="saveForm"
            color="primary"
            :disabled="!validForm"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>
