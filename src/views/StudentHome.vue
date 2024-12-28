<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import ApplicationServices from "../services/ApplicationServices";
import { ref } from "vue";
const router = useRouter();
const application = ref(null);
const appComplete = ref(false);
import store from "../store/store";

const user = ref(null);

const goToApplication = () => {
  router.push({ name: "application" });
};

const checkCurrentApplication = async () => {
  try {
    user.value = store.getters.getUser;
    await ApplicationServices.getApplicationsByUserId(user.value.id).then(
      (response) => {
        application.value = response.data[0];
        if (application.value.status === "submitted") {
          appComplete.value = true;
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  checkCurrentApplication();
});
</script>

<template>
  <div class="container" width="100%" height="100%">
    <v-container>
      <v-col>
        <div v-if="appComplete">
          <v-row align="center">
            <v-col>
              <v-card-title align="center">
                Thanks for using OneApp!
              </v-card-title>
              <v-card-text align="center">
                Your application has been submitted.
              </v-card-text>
              <v-card-text align="center">
                Thank you for applying to college using CHEF.
              </v-card-text>
            </v-col>
          </v-row>
        </div>
        <div v-if="!appComplete">
          <v-card-title align="center"> Welcome to OneApp! </v-card-title>
          <v-card-text align="center">
            Complete an application so that your data can be shared with our
            partner universites. By completing this application you grant CHEF
            permission to share your application data with our partner
            universities.
          </v-card-text>
          <v-card-text align="center">
            <v-btn
              variant="outlined"
              elevation="0"
              density="comfortable"
              @click="goToApplication"
              color="primary"
            >
              Enter/Update Application
            </v-btn>
          </v-card-text>
        </div>
      </v-col>
    </v-container>
  </div>
</template>
