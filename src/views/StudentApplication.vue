<script setup>
import PageServices from "../services/PageServices";
import ApplicationServices from "../services/ApplicationServices";
import StudentPages from "../components/student/StudentPages.vue";
import StudentPageView from "../components/student/StudentPageView.vue";
import StudentPageGroup from "../components/student/StudentPageGroup.vue";
import AppSubDiaglog from "../components/AppSubmitDialog.vue";
import store from "../store/store";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const pages = ref([]);
const activePage = ref({});
const pageKey = ref(0);
const user = ref(null);
const application = ref(null);
const showPrevBtn = ref(false);
const showNextBtn = ref(false);
const showSubmitBtn = ref(false);
const showSubmitDialog = ref(false);
const appId = ref(null);

const submitApplication = async () => {
  application.value.status = "submitted";
  await ApplicationServices.updateApplications(application.value);
  closeDialog();
  router.push({ name: "studentHome" });
};

const closeDialog = () => {
  showSubmitDialog.value = false;
};

const showSubDialog = () => {
  showSubmitDialog.value = true;
};

const forceUpdate = async () => {
  await retrievePages(false);
  pageKey.value += 1;
  setNavButtons();
};

const changeActivePage = (page) => {
  activePage.value = page;
  forceUpdate();
};

const setNavButtons = () => {
  const index = pages.value.indexOf(activePage.value);

  if (index + 1 == pages.value.length) {
    showNextBtn.value = false;
    showSubmitBtn.value = true;
  } else {
    showNextBtn.value = true;
    showSubmitBtn.value = false;
  }
  if (index == 0) {
    showPrevBtn.value = false;
  } else {
    showPrevBtn.value = true;
  }
};

const nextPage = () => {
  const index = pages.value.indexOf(activePage.value);
  if (index < pages.value.length - 1) {
    activePage.value = pages.value[index + 1];

    forceUpdate();
  }
};

const prevPage = () => {
  const index = pages.value.indexOf(activePage.value);

  if (index > 0) {
    activePage.value = pages.value[index - 1];

    forceUpdate();
  }
};

const retrieveApplications = async () => {
  try {
    await ApplicationServices.getApplicationsByUserId(user.value.id).then(
      (response) => {
        application.value = response.data[0];
        appId.value = response.data.id;
      }
    );

    if (!application.value) {
      await createApplication();
    }
  } catch (err) {
    console.error(err);
  }
};

const createApplication = async () => {
  try {
    const application = {
      status: "pending",
      userId: user.value.id,
    };
    await ApplicationServices.addApplications(application).then((response) => {
      application.value = response.data;
      appId.value = response.data.id;
    });
  } catch (err) {
    console.error(err);
  }
};

const retrievePages = async (setActive) => {
  try {
    await PageServices.getPagesByUserId(user.value.id).then((response) => {
      pages.value = response.data;
    });

    pages.value.sort((a, b) => {
      return a.pageSequence - b.pageSequence;
    });
    pages.value.forEach((page) => {
      page.pageGroups.sort((a, b) => {
        return a.groupSequence - b.groupSequence;
      });
    });

    pages.value.forEach((page) => {
      page.pageGroups.forEach((group) => {
        group.fieldPageGroups.sort((a, b) => {
          return a.sequenceNumber - b.sequenceNumber;
        });
      });
    });

    if (setActive) {
      activePage.value = pages.value[0];
    } else {
      let newActivePage = pages.value.find((page) => {
        return page.id == activePage.value.id;
      });

      activePage.value = pages.value[pages.value.indexOf(newActivePage)];
    }
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  user.value = store.getters.getUser;
  await retrieveApplications();
  await retrievePages(true);
  setNavButtons();
});
</script>

<template>
  <div>
    <StudentPages
      :pages="pages"
      :activePage="activePage"
      @change-active-page="changeActivePage"
      @display-sub-diaglog="showSubDialog"
    />
    <StudentPageView
      v-if="pages.length > 0"
      :page="activePage"
      :key="pageKey"
    />
    <div v-for="pageGroup in activePage.pageGroups" class="mb-4 mr-4 ml-4">
      <StudentPageGroup :applicationId="appId" :page-group="pageGroup" />
      <div
        v-for="pageGroup in activePage.pageGroups"
        class="mb-4 mr-4 ml-4"
      ></div>
    </div>
    <v-card>
      <v-card-actions align="center">
        <v-btn
          v-if="showPrevBtn"
          @click="prevPage"
          class="mx-4 my-4"
          color="primary"
          >Previous Page</v-btn
        >
        <v-btn
          v-if="showNextBtn"
          @click="nextPage"
          class="mx-4 my-4"
          color="primary"
          >Next Page</v-btn
        >
        <v-btn
          v-if="showSubmitBtn"
          @click="showSubDialog"
          class="mx-4 my-4"
          color="primary"
          >Submit Application</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-dialog v-model="showSubmitDialog" max-width="600px">
      <AppSubDiaglog
        @close-dialog="closeDialog"
        @submitApplication="submitApplication"
      />
    </v-dialog>
  </div>
</template>
