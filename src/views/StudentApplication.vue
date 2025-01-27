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
import FormServices from "../services/FormServices";
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
const formId = ref(null);

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
  validatePages();
  pageKey.value += 1;
  setNavButtons();
};
const revalidateApp = async (pageGroup, pageGroupIndex) => {
  activePage.value.pageGroups[pageGroupIndex] = pageGroup;
  validatePages();
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
  await ApplicationServices.getApplicationsByUserId(user.value.id)
    .then(async (response) => {
      if (response.data.length > 0) {
        application.value = response.data[0];
        application.value.isComplete = false;
        appId.value = application.value.id;
        formId.value = application.value.formId;
      }
      if (application.value == null) {
        await createApplication();
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const createApplication = async () => {
  await FormServices.getMainForm()
    .then((response) => {
      formId.value = response.data[0].id;
    })
    .catch((err) => {
      console.error(err);
    });

  const newApplication = {
    status: "pending",
    userId: user.value.id,
    formId: formId.value,
  };
  await ApplicationServices.addApplications(newApplication)
    .then((response) => {
      console.log(response.data);
      application.value = response.data;
      application.value.isComplete = false;
      appId.value = application.value.id;
    })
    .catch((err) => {
      console.error(err);
    });
};

const retrievePages = async (setActive) => {
  try {
    await PageServices.getPagesByUserId(user.value.id, formId.value).then(
      (response) => {
        pages.value = response.data;
      }
    );

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
        group.fieldPageGroups.forEach((fpg) => {
          fpg.field.appFieldValues.sort((a, b) => {
            return a.setNumber - b.setNumber;
          });
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

const validatePages = () => {
  console.log("validating app");
  console.log(pages.value);
  if (application.value == null) {
    return;
  }

  application.value.isComplete = true;
  pages.value.forEach((page) => {
    page.pageGroups.forEach((group) => {
      group.isComplete = true;
      group.fieldPageGroups.forEach((fpg) => {
        fpg.isComplete = true;
        if (fpg.field.isRequired) {
          if (fpg.field.appFieldValues.length < group.minSetCount) {
            application.value.isComplete = false;
            group.isComplete = false;
            fpg.isComplete = false;
          }
          fpg.field.appFieldValues.forEach((afv) => {
            if (afv.fieldValueName == null || afv.fieldValueName == "") {
              application.value.isComplete = false;
              group.isComplete = false;
              fpg.isComplete = false;
            }
          });
        }
      });
    });
  });
};

const submitDisabled = () => {
  if (application.value == null) {
    return true;
  }
  return !application.value.isComplete;
};
onMounted(async () => {
  user.value = store.getters.getUser;
  await retrieveApplications().then(async () => {
    console.log("app status: ");
    console.log(application.value);
    if (application.value.status == "submitted") {
      router.push({ name: "studentHome" });
    }
    await retrievePages(true);
    validatePages();
    setNavButtons();
  });
});
</script>

<template>
  <div>
    <StudentPages
      :pages="pages"
      :activePage="activePage"
      :application="application"
      @change-active-page="changeActivePage"
      @display-sub-diaglog="showSubDialog"
    />
    <StudentPageView
      v-if="pages.length > 0"
      :page="activePage"
      :key="pageKey"
    />
    <div v-for="pageGroup in activePage.pageGroups" class="mb-4 mr-4 ml-4">
      <StudentPageGroup
        :applicationId="appId"
        :page-group="pageGroup"
        @revalidateApp="revalidateApp"
      />
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
          :disabled="submitDisabled()"
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
