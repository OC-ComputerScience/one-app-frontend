<script setup>
import { onMounted, ref } from "vue";
import LoginDialog from "../components/LoginDialog.vue";
import store from "../store/store.js";

const showLogin = ref(false);
const showSignup = ref(false);
const showPrivacyNotice = ref(false);

store.commit("removeLoginUser");

const changeLoginState = () => {
  showLogin.value = !showLogin.value;
};
const changeSignupState = () => {
  showSignup.value = !showSignup.value;
};
const closeLogin = () => {
  showLogin.value = false;
  showSignup.value = false;
};

const togglePrivacyNotice = () => {
  showPrivacyNotice.value = !showPrivacyNotice.value;
};

onMounted(() => {
  store.commit("removeLoginUser");
});
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
            <v-row justify="center" class="mt-4">
              <v-col cols="auto">
                <v-btn
                  variant="text"
                  color="primary"
                  @click="togglePrivacyNotice"
                  class="text-decoration-none"
                >
                  Privacy Notice
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog
      scrollable
      v-model="showSignup"
      max-width="600px"
      content-class="my-custom-dialog"
    >
      <LoginDialog
        :displayLoginFirst="false"
        @close-dialog="changeSignupState"
      />
    </v-dialog>
    <v-dialog v-model="showLogin" max-width="800px">
      <LoginDialog :displayLoginFirst="true" @close-dialog="closeLogin" />
    </v-dialog>

    <v-dialog v-model="showPrivacyNotice" max-width="800px">
      <v-card>
        <v-card-title class="text-h5">
          Privacy Policy
          <v-spacer></v-spacer>
          <v-btn icon @click="togglePrivacyNotice">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-4">
          <h3 class="text-h6">1. Introduction</h3>
          <p>
            This Privacy Policy describes how the Christian Higher Education
            Foundation (we, us, our) collects, uses, and discloses your personal
            information when you use our website/service/app (the "Service"). By
            using the Service, you consent to the collection, use, and
            disclosure of your information as described in this Privacy Policy.
          </p>

          <h3 class="text-h6 mt-4">2. Information We Collect</h3>
          <p><strong>Personally Identifiable Information (PII):</strong></p>
          <p>
            We may collect PII such as your name, email address, physical
            address, phone number, and other information you voluntarily provide
            when using the Service.
          </p>

          <p>
            <strong>Non-Personally Identifiable Information (Non-PII):</strong>
          </p>
          <p>
            We may also collect non-PII such as your IP address, browser type,
            device type, and other technical information about your use of the
            Service.
          </p>

          <p><strong>Cookies and Similar Technologies:</strong></p>
          <p>
            We may use cookies and similar technologies to collect information
            about your use of the Service, including your browsing history and
            preferences.
          </p>

          <h3 class="text-h6 mt-4">3. How We Use Your Information</h3>
          <p><strong>Providing and Improving the Service:</strong></p>
          <p>
            We use your information to provide, maintain, and improve the
            Service, including personalizing your experience and responding to
            your requests.
          </p>

          <p><strong>Sale of Information:</strong></p>
          <p>
            We sell your information to Christian colleges and universities.
          </p>

          <p><strong>Communication:</strong></p>
          <p>
            We may use your information to communicate with you about the
            Service, including updates, promotions, and customer support.
          </p>

          <p><strong>Analytics:</strong></p>
          <p>
            We may use your information for analytics purposes to understand how
            the Service is used and to improve our products and services.
          </p>

          <p><strong>Legal Compliance:</strong></p>
          <p>
            We may use your information to comply with legal obligations and to
            protect our rights and interests.
          </p>

          <h3 class="text-h6 mt-4">4. How We Share Your Information</h3>
          <p><strong>Third-Party Service Providers:</strong></p>
          <p>
            We may share your information with third-party service providers who
            help us operate the Service, such as payment processors, email
            providers, and analytics providers.
          </p>

          <p><strong>Legal Compliance:</strong></p>
          <p>
            We may disclose your information to law enforcement or other
            authorities if required by law or if we believe it is necessary to
            protect our rights or the rights of others.
          </p>

          <p><strong>Business Transfers:</strong></p>
          <p>
            We may share your information in connection with a merger,
            acquisition, or sale of our business.
          </p>

          <h3 class="text-h6 mt-4">5. Your Rights</h3>
          <p>
            <strong>Access:</strong> You have the right to access the personal
            information we hold about you.
          </p>
          <p>
            <strong>Rectification:</strong> You have the right to request that
            we correct any inaccuracies in your personal information.
          </p>
          <p>
            <strong>Deletion:</strong> You have the right to request that we
            delete your personal information.
          </p>
          <p>
            <strong>Portability:</strong> You have the right to request that we
            provide you with a copy of your personal information in a portable
            format.
          </p>
          <p>
            <strong>Opt-Out:</strong> You have the right to opt-out of certain
            uses of your personal information, such as marketing communications.
          </p>

          <h3 class="text-h6 mt-4">6. Security</h3>
          <p>
            We take reasonable measures to protect your personal information
            from unauthorized access, use, or disclosure.
          </p>

          <h3 class="text-h6 mt-4">7. Children's Privacy</h3>
          <p>
            Our Service is not directed to children under the age of 15. We do
            not knowingly collect personal information from children under the
            age of 15.
          </p>

          <h3 class="text-h6 mt-4">8. Changes to this Privacy Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. We will post
            any changes to this Privacy Policy on our website/service/app.
          </p>

          <h3 class="text-h6 mt-4">9. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at OneApp@ChefScholars.org
          </p>

          <h3 class="text-h6 mt-4">10. Governing Law</h3>
          <p>
            This Privacy Policy shall be governed by and construed in accordance
            with the laws of the State of Texas.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="togglePrivacyNotice">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
:deep(.my-custom-dialog) {
  align-self: flex-end;
}
</style>
