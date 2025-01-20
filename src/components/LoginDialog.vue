<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";
import RoleServices from "../services/RoleServices";
import UniversityServices from "../services/UniversityServices";
import store from "../store/store";
import states from "../config/states";

const emit = defineEmits(["closeDialog"]);
const props = defineProps(["displayLoginFirst"]);

const router = useRouter();
const agree = ref(false);
var howHeard = ["Church", "Family", "Social Media", "Internet Search", "Other"];
var hsgradyear = ["2025", "2026", "2027", "2028", "2029", "2030"];
const roles = ref([]);
const universities = ref([]);
const login = ref(props.displayLoginFirst);
const validForm = ref(false);

const cardTitle = computed(() => {
  return login.value ? "Log In to OneApp" : "Sign Up for OneApp";
});

const loginBtnTitle = computed(() => {
  return login.value ? "Log In" : "Sign Up";
});
const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  zip: "",
  congregation: "",
  howHeard: "",
  status: "inactive",
  resetCode: "",
  password: "",
  salt: "",
  roleId: 2,
  universityId: null,
  hsgradyear: null,
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
  store.commit("removeLoginUser");

  if (login.value) {
    try {
      let response = await UserServices.loginUser(user.value);
      let loginUser = response.data;

      store.commit("setLoginUser", loginUser);
      let role = await RoleServices.getRoleById(loginUser.roleId);
      loginUser.role = role.data.type;

      store.commit("setLoginUser", loginUser);
      router.push({ name: "home" });
    } catch (err) {
      console.error(err);
      errorMessage.value = err.response.data.message;
    }
  } else {
    try {
      if (user.value.roleId == 2) {
        user.value.status = "active";
      } else {
        user.value.status = "inactive";
      }
      await UserServices.addUser(user.value)
        .then(async (response) => {
          response = await UserServices.loginUser(user.value);
          let loginUser = response.data;
          store.commit("removeLoginUser");
          store.commit("setLoginUser", loginUser);
          let role = await RoleServices.getRoleById(loginUser.roleId);
          loginUser.role = role.data.type;
          store.commit("removeLoginUser");
          store.commit("setLoginUser", loginUser);
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
const changeRole = (value) => {
  if ((user.value.id = 2)) user.value.status = "active";
  else user.value.status = "inactive";
};
const closeDialog = () => {
  emit("closeDialog");
};
onMounted(async () => {
  try {
    let response = await RoleServices.getAllRoles();
    roles.value = response.data;
    response = await UniversityServices.getAllUniversities();
    universities.value = response.data;
  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title>{{ cardTitle }}</v-card-title>

        <v-card-text>
          <v-form v-model="validForm">
            <v-autocomplete
              v-if="!login"
              v-model="user.roleId"
              :items="roles"
              item-title="type"
              item-value="id"
              label="Type of User"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              @update:modelValue="changeRole"
            ></v-autocomplete>
            <v-autocomplete
              v-if="!login && user.roleId == 3"
              v-model="user.universityId"
              :items="universities"
              item-title="name"
              item-value="id"
              label="University Name"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
            ></v-autocomplete>
            <v-row dense v-if="!login">
              <v-col cols="6">
                <v-text-field
                  v-model="user.firstName"
                  label="First Name"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="6">
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
              v-if="!login && user.roleId == 2"
              v-model="user.streetAddress"
              label="Street Address"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
            />

            <v-row dense v-if="!login && user.roleId == 2">
              <v-col cols="6">
                <v-text-field
                  class="md-4"
                  v-model="user.city"
                  label="City"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="3">
                <v-autocomplete
                  v-model="user.state"
                  :items="states.states"
                  label="State"
                  placeholder="State"
                  item-title="value"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  class="md-4"
                  v-model="user.zip"
                  label="Zip Code"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col v-if="login" cols="12">
                <v-text-field
                  class=""
                  v-model="user.email"
                  label="Email"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required, rules.email]"
                />
              </v-col>
              <v-col v-if="!login" cols="6">
                <v-text-field
                  class=""
                  v-model="user.email"
                  label="Email"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required, rules.email]"
                />
              </v-col>
              <v-col v-if="!login" cols="6">
                <v-text-field
                  class="ma-0 pa-0"
                  v-if="!login"
                  v-model="user.phone"
                  label="Phone"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                />
              </v-col>
            </v-row>
            <v-text-field
              v-if="!login && user.roleId == 2"
              v-model="user.congregation"
              label="Church congregation you attend"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
            />

            <v-row dense>
              <v-col cols="6">
                <v-autocomplete
                  v-if="!login && user.roleId == 2"
                  v-model="user.hsgradyear"
                  :items="hsgradyear"
                  label="HS Grad Year"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  v-if="!login && user.roleId == 2"
                  v-model="user.howHeard"
                  :items="howHeard"
                  label="How did you hear about OneApp"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-if="login"
                  v-model="user.password"
                  label="Password"
                  variant="outlined"
                  density="compact"
                  type="password"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-if="!login"
                  v-model="user.password"
                  label="Password"
                  variant="outlined"
                  density="compact"
                  type="password"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-if="!login"
                  v-model="confirmPassword"
                  label="Confirm Password"
                  variant="outlined"
                  density="compact"
                  type="password"
                  :rules="[rules.required, rules.passwordCheck]"
                />
              </v-col>
            </v-row>
            <v-checkbox
              v-if="!login && user.roleId == 2"
              v-model="agree"
              label="I agree for CHEF to share my data with partner universities."
              :rules="[rules.required]"
            >
            </v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-text align="center" class="text-red">{{
          errorMessage
        }}</v-card-text>
        <v-card-actions align="right">
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
