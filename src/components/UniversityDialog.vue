<script setup>

import { ref, computed } from "vue";
import UniversityServices from "../services/UniversityServices";
import { defineProps, defineEmits } from "vue";

const emit = defineEmits(["updateList", "closeDialog"]);
const props = defineProps(["universityData"]);

var action = "";
const university = ref({});

if (props.universityData == null) {
     university.value =   
        { name: "",
        abrev: "",
        city: "",
        state: "",
        url: "",
        relationship: "",
        status: "",
        };
        action = "Add";}
 else {
    university.value = JSON.parse(JSON.stringify(props.universityData));
    action = "Update";
}

const validForm = ref(false);

const relationships = ["Partner", "None"];
const statuses = ["Active", "Inactive"];

const errorMessage = ref("");
const rules = {
  required: (value) => !!value || "Required.",

};

const saveUniversity = () => {
  if (action === "Update") {    
    updateUniversity(university.value);
  } else {
    addUniversity(university.value);
  }
};

const updateUniversity = (university) => {

  UniversityServices.updateUniversity(university).then(() => {
    emit("updateList");
    closeDialog();
  }).catch((e) => {
    errorMessage.value = e.response.data.message;
  });
};
const addUniversity = (university) => {
  UniversityServices.addUniversity(university)
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
        <v-card-title>{{ action }} University</v-card-title>
        <v-card-text class="mt-2 mb-n4">
          <v-form v-model="validForm">
                <v-text-field
                  v-model="university.name"
                  label="Name"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                />
                <v-text-field
                  v-model="university.abrev"
                  label="Abreviation"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                />
            <v-row>
                <v-col>
                    <v-text-field
                    v-model="university.city"
                    label="City"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                    />
                </v-col>
                <v-col>
                    <v-text-field
                    v-model="university.state"
                    label="State"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                    </v-text-field>
                </v-col>
            </v-row>
            <v-text-field
                v-model="university.url"
              label="Website URL"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
            />
            <v-combobox
              v-model="university.relationship"
              :items="relationships"
              label="Relationship"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
            ></v-combobox>
            <v-combobox
              v-model="university.status"
              :items="statuses"
              label="Status"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
            ></v-combobox>
          </v-form>
        </v-card-text>
        <v-card-text align="center" class="text-red">{{
          errorMessage
        }}</v-card-text>
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
            @click="saveUniversity"
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
