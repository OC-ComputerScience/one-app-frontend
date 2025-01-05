<script setup>
import store from "../store/store.js";
import { ref } from "vue";

const user = ref(null);
user.value = store.getters.getUser;
</script>

<template>
  <v-card>
    <v-card-title align="center"> Welcome to OneApp! </v-card-title>
    <v-card-subtitle align="center">
      Your home for Church of Christ college applications.
    </v-card-subtitle>

    <v-card-text v-if="user.status === 'inactive'" align="center">
      Your account has not been made active. It needs to be reviewed and
      approved by an site administrator.
    </v-card-text>
  </v-card>
</template>
