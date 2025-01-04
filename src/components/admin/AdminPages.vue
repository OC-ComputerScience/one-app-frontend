<script setup>
import { ref, onMounted, onUpdated } from "vue";
import PageServices from "../../services/PageServices";

const props = defineProps(["pages", "activePage", "formId"]);
const emit = defineEmits(["changeActivePage"]);

const activePage = ref({});
const newPage = ref({});
const createNew = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const pages = ref([]);

pages.value = props.pages;

const addNewPage = async () => {
  newPage.value.formId = props.formId;
  newPage.value.pageSequence = pages.value.length;
  newPage.value.text = "";
  newPage.value.pageGroups = [];
  pages.value.push(newPage.value);
  createNew.value = false;
  try {
    let response = await PageServices.addPages(newPage.value);
    newPage.value.id = response.data.id;
    snackbarText.value = "Page Added Successfully";
  } catch (err) {
    console.error(err);
    snackbarText.value = "Failed to add page";
  } finally {
    activePage.value = pages.value[pages.value.length - 1];
    console.log(pages);
    console.log("addNewPage" + activePage.value);
    newPage.value = {};
    snackbar.value = true;
    emit("changeActivePage", activePage.value);
  }
};

const changeActivePage = () => {
  emit("changeActivePage", activePage.value);
};

onMounted(() => {
  activePage.value = props.activePage;
  pages.value = props.pages;
});

onUpdated(() => {
  activePage.value = props.activePage;
  pages.value = props.pages;
});
</script>

<template>
  <div>
    <v-navigation-drawer permanent>
      <v-tabs
        v-model="activePage"
        color="primary"
        direction="vertical"
        @update:modelValue="changeActivePage"
      >
        <v-tab
          v-for="page in pages"
          :key="page.id"
          :text="page.title"
          :value="page"
        ></v-tab>
      </v-tabs>
      <div class="ml-2 mt-2">
        <v-btn
          v-if="!createNew"
          density="comfortable"
          rounded="xl"
          color="primary"
          class="ml-1"
          @click="
            () => {
              createNew = true;
            }
          "
          >+ Page</v-btn
        >
        <v-text-field
          v-if="createNew"
          v-model="newPage.title"
          density="compact"
          variant="outlined"
          label="Page Name"
          v-on:blur="addNewPage"
          class="mr-2"
        ></v-text-field>
      </div>
    </v-navigation-drawer>
  </div>
  <v-snackbar v-model="snackbar" :timeout="2000">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-icon
        color="accent"
        icon="mdi-close"
        variant="text"
        @click="snackbar = false"
      ></v-icon>
    </template>
  </v-snackbar>
</template>
