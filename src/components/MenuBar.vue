<script setup>
import logo from "/chef.png";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";
import store from "../store/store";
import ApplicationServices from "../services/ApplicationServices";

const router = useRouter();

const user = ref(null);
const title = ref("OneApp");
const logoURL = ref("");

const application = ref(null);
const appComplete = ref(false);

const checkCurrentApplication = async () => {
  if (store.getters.getUser === null) {
    return;
  }
  try {
    user.value = store.getters.getUser;
    await ApplicationServices.getApplicationsByUserId(user.value.id).then(
      (response) => {
        if (response.data.length === 0) {
          return;
        }
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
  logoURL.value = logo;
  user.value = JSON.parse(localStorage.getItem("user"));
  checkCurrentApplication();
});

function logout() {
  UserServices.logoutUser()
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });

  store.commit("removeLoginUser");
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
          height="100"
          width="100"
          contain
        ></v-img>
      </router-link>
      <div class="text-h5">{{ title }}</div>
      <v-spacer></v-spacer>
      <div v-if="user">
        <div v-if="user.role === 'Admin' && user.status === 'active'">
          <v-btn class="mx-2" :to="{ name: 'formList' }"> Forms </v-btn>
          <v-btn class="mx-2" :to="{ name: 'userList' }"> Users </v-btn>
          <v-btn class="mx-2" :to="{ name: 'universityList' }">
            Universities
          </v-btn>
        </div>
        <div v-else-if="user.role === 'University' && user.status === 'active'">
          <v-btn class="mx-2" :to="{ name: 'formList' }"> Forms </v-btn>
        </div>
        <div
          v-else-if="
            user.role === 'Student' && !appComplete && user.status === 'active'
          "
        >
          <v-btn class="mx-2" :to="{ name: 'application' }">
            Application
          </v-btn>
        </div>
      </div>

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
