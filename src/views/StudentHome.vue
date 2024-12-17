<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goToApplication = () => {
  router.push({ name: "application" });
};
</script>

<template>
  <div class="container" width="100%" height="100%">
    <v-container>
      <v-col>
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
      </v-col>
    </v-container>
  </div>
</template>
