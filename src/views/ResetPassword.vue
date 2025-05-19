<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserServices from "../services/UserServices";

const route = useRoute();
const router = useRouter();
const token = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(false);

const rules = {
  required: (value) => !!value || "Required.",
  passwordLength: (value) =>
    value.length >= 8 || "Password must be at least 8 characters",
  passwordMatch: (value) =>
    value === newPassword.value || "Passwords do not match",
};

onMounted(() => {
  // Get token from URL and decode it
  token.value = decodeURIComponent(route.params.token);
  if (!token.value) {
    errorMessage.value = "Invalid reset link";
  }
});

const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match";
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    await UserServices.resetPassword(token.value, newPassword.value);
    successMessage.value =
      "Password has been reset successfully. You can now log in with your new password.";
    // Remove automatic redirect
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message ||
      "Failed to reset password. Please try again.";
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push("/");
};
</script>

<template>
  <v-container class="fill-height" style="overflow: hidden">
    <v-row justify="center" align="center" class="ma-0" style="height: 100vh">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4">
          <v-card-title class="text-h5 text-center">
            Reset Your Password
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="resetPassword">
              <v-text-field
                v-model="newPassword"
                label="New Password"
                type="password"
                variant="outlined"
                density="compact"
                :rules="[rules.required, rules.passwordLength]"
                class="mb-4"
                :disabled="!!successMessage"
              />

              <v-text-field
                v-model="confirmPassword"
                label="Confirm New Password"
                type="password"
                variant="outlined"
                density="compact"
                :rules="[rules.required, rules.passwordMatch]"
                class="mb-4"
                :disabled="!!successMessage"
              />

              <v-alert v-if="errorMessage" type="error" class="mb-4">
                {{ errorMessage }}
              </v-alert>

              <v-alert v-if="successMessage" type="success" class="mb-4">
                {{ successMessage }}
              </v-alert>

              <v-btn
                v-if="!successMessage"
                block
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="!newPassword || !confirmPassword"
                class="mb-4"
              >
                Reset Password
              </v-btn>

              <v-btn
                v-if="successMessage"
                block
                color="primary"
                @click="goToLogin"
                class="mb-4"
              >
                Go to Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
