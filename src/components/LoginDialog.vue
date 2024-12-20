<script setup>
import { onMounted } from "vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";
import RoleServices from "../services/RoleServices";
import Utils from "../config/utils.js";

const emit = defineEmits(["closeDialog"]);
const router = useRouter();
const props = defineProps(["displayLoginFirst"]);

const login = ref(props.displayLoginFirst);
const validForm = ref(false);
const cardTitle = computed(() => {
  return login.value ? "Log In" : "Sign Up";
});
const changeFormTitle = computed(() => {
  return login.value ? "Create Account" : "Log In";
});
const loginBtnTitle = computed(() => {
  return login.value ? "Log In" : "Sign Up";
});
const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});
const errorMessage = ref("");
const confirmPassword = ref("");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const rules = {
  required: (value) => !!value || "Required.",
  email: (value) => emailRegex.test(value) || "Invalid Email",
  passwordCheck: (value) =>
    user.value.password === value || "Password does not match",
};

const signIn = async () => {
  errorMessage.value = "";
  Utils.removeItem("user");
  if (login.value) {
    try {
      let response = await UserServices.loginUser(user.value);
      let loginUser = response.data;
      Utils.setStore("user", loginUser);
      let role = await RoleServices.getRoleById(loginUser.roleId);
      loginUser.role = role.data.type;
      Utils.removeItem("user");
      Utils.setStore("user", loginUser);

      router.push({ name: "home" });
    } catch (err) {
      console.error(err);
      errorMessage.value = err.response.data.message;
    }
  } else {
    try {
      await UserServices.addUser(user.value)
        .then(async (response) => {
          response = await UserServices.loginUser(user.value);
          let loginUser = response.data;
          Utils.setStore("user", loginUser);
          let role = await RoleServices.getRoleById(loginUser.roleId);
          loginUser.role = role.data.type;
          Utils.removeItem("user");
          Utils.setStore("user", loginUser);
          router.push({ name: "home" });
        })
        .catch((error) => {
          console.log(error);
          errorMessage.value = err.response.data.message;
        });
    } catch (err) {
      errorMessage.value = err.response.data.message;
      console.error(err);
    }
  }
};

const closeDialog = () => {
  emit("closeDialog");
};
</script>

<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title>{{ cardTitle }}</v-card-title>
        <v-card-text class="mt-2 mb-n4">
          <v-form v-model="validForm">
            <v-row v-if="!login">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="user.firstName"
                  label="First Name"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="user.lastName"
                  label="Last Name"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                />
              </v-col>
            </v-row>
            <v-text-field
              v-model="user.email"
              label="Email"
              variant="outlined"
              density="compact"
              :rules="[rules.required, rules.email]"
            />
            <v-text-field
              v-model="user.password"
              label="Password"
              variant="outlined"
              density="compact"
              type="password"
              :rules="[rules.required]"
            />
            <v-text-field
              v-if="!login"
              v-model="confirmPassword"
              label="Confirm Password"
              variant="outlined"
              density="compact"
              type="password"
              :rules="[rules.required, rules.passwordCheck]"
            />
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
            @click="signIn"
            color="primary"
            :disabled="!validForm"
          >
            {{ loginBtnTitle }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>
