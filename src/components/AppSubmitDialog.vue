<script setup>
import { ref } from "vue";
console.log("dialgo");
const emits = defineEmits(["closeDialog", "submitApplication"]);
const confirm = ref(false);
</script>

<template>
  <v-card>
    <v-toolbar color="#FFFFFF">
      <v-toolbar-title> Submit Your Application </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      Submit your application to the CHEF. Once you submit, you will not be able
      to make any changes.
    </v-card-text>
    <v-checkbox
      v-model="confirm"
      label="I confirm that I have reviewed my application and am ready to submit.  I also agree that by clickng this box that I give CHEF permission to send my applicaiton data to CHEF partner universites."
      color="primary"
    ></v-checkbox>
    <v-card-actions align="right" class="mr-2 mb-2">
      <v-btn
        variant="plain"
        elevation="0"
        density="comfortable"
        @click="emits('closeDialog')"
        color="secondary"
      >
        Cancel
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!confirm"
        variant="outlined"
        elevation="0"
        density="comfortable"
        @click="emits('submitApplication')"
        color="accent"
      >
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
