<script setup>
import ocLogo from "/oc_logo.png";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";
import Utils from "../config/utils";

const router = useRouter();

const user = ref(null);
const title = ref("OneApp");
const logoURL = ref("");

onMounted(() => {
  logoURL.value = ocLogo;
  user.value = JSON.parse(localStorage.getItem("user"));
});

function logout() {
  UserServices.logoutUser()
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  localStorage.removeItem("user");
  Utils.removeItem("user")
  user.value = null;
  router.push({ name: "login" });
}
</script>

<template>
  <div>
    <v-app-bar app color="primary">
      <router-link :to="{ name: 'home' }">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          contain
        ></v-img>
      </router-link>
      <div v-if="user">
        <div v-if="user.role === 'Admin'">
          <v-btn class="mx-2" :to="{ name: 'editForm' }"> Form </v-btn>
          <v-btn class="mx-2" > Students </v-btn>
          <v-btn class="mx-2" > Universities </v-btn>
        </div>
        <div v-else-if="user.role === 'Student'">
          <v-btn class="mx-2" :to="{ name: 'application' }"> Application </v-btn>
        </div>
      </div>
      
      <!-- <v-btn class="mx-2" :to="{ name: 'recipes' }"> Recipes </v-btn> -->
      
      <!-- <v-btn v-if="user !== null" class="mx-2" :to="{ name: 'ingredients' }">
        Ingredients
      </v-btn> -->
      <v-spacer></v-spacer>
      <v-menu v-if="user !== null" min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar class="mx-auto text-center" color="accent" size="large">
              <span class="white--text font-weight-bold">{{
                `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="accent">
                <span class="white--text text-h5">{{
                  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                }}</span>
              </v-avatar>
              <h3>{{ `${user.firstName} ${user.lastName}` }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn rounded variant="text" @click="logout()"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>
