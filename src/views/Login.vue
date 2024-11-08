<script setup>
import { ref } from "vue"
import LoginDialog from "../components/LoginDialog.vue";

const showLogin = ref(false)

const changeLoginState = () => {
  showLogin.value = !showLogin.value
}

</script>

<template>
<div class="container" width="100%" height="100%">
<v-container> 
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10" md="8" lg="6" class="mt-16">
      <v-card class="">
        <v-card-title align="center">
          Welcome to OneApp!
        </v-card-title>
        <v-card-subtitle align="center">
          Your home for Church of Christ college applications.
        </v-card-subtitle>
        <v-card-text align="center">
          <v-btn 
            variant="outlined"
            elevation="0"
            density="comfortable" 
            @click="changeLoginState"
            color="primary"
          >
            Log In
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  
</v-container>

<v-dialog v-model="showLogin" max-width="600px">
  <LoginDialog 
    @close-dialog="changeLoginState"
  />
</v-dialog>
  
</div>

</template>