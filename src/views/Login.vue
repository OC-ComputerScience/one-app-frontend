<script setup>
import { ref } from "vue";
import LoginDialog from "../components/LoginDialog.vue";
import Utils from "../config/utils.js";

const showLogin = ref(false);
const showSignup = ref(false);
Utils.removeItem("user");

const changeLoginState = () => {
  showLogin.value = !showLogin.value;
};
const changeSignupState = () => {
  showSignup.value = !showSignup.value;
};
</script>

<template>
  <div class="container" width="100%" height="100%">
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="10" md="8" lg="6" class="mt-16">
          <v-col class="">
            <v-card-title align="center"> Welcome to OneApp! </v-card-title>
            <v-card-subtitle align="center">
              Your home for Church of Christ college applications.
            </v-card-subtitle>
            <v-row>
              <v-col>
                <v-card-text align="center">
                  Sign up for an new account
                </v-card-text>
                <v-card-text align="center">
                  <v-btn
                    variant="outlined"
                    elevation="0"
                    density="comfortable"
                    @click="changeSignupState"
                    color="primary"
                  >
                    Sign Up
                  </v-btn>
                </v-card-text>
              </v-col>
              <v-col>
                <v-card-text align="center">
                  Login to your existing account
                </v-card-text>
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
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showSignup" max-width="600px">
      <LoginDialog
        :displayLoginFirst="false"
        @close-dialog="changeSignupState"
      />
    </v-dialog>
    <v-dialog v-model="showLogin" max-width="600px">
      <LoginDialog
        :displayLoginFirst="true"
        @close-dialog="changeSignupState"
      />
    </v-dialog>
  </div>
</template>
