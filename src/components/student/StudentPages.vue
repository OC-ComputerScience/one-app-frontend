<script setup>
import { ref, onMounted, onUpdated } from "vue";

const props = defineProps(["pages", "activePage", "application"]);
const emit = defineEmits(["changeActivePage", "displaySubDiaglog"]);

const currentActivePage = ref({});

const changeActivePage = () => {
  emit("changeActivePage", currentActivePage.value);
};
const displaySubDiaglog = () => {
  emit("displaySubDiaglog");
};

const isDisabled = () => {
  if (props.application == null) return true;
  if (!Object.hasOwn(props.application, "isComplete")) return true;
  return !props.application.isComplete;
};

onMounted(() => {
  window.scrollTo(0, 0);
  currentActivePage.value = props.activePage;
});

onUpdated(() => {
  window.scrollTo(0, 0);
  currentActivePage.value = props.activePage;
});
</script>

<template>
  <div>
    <v-navigation-drawer permanent>
      <div align="center" class="text-subtitle-2 ml-4 mt-5">
        Complete these pages and
      </div>
      <div align="center" class="text-subtitle-2 ml-4">then click submit</div>
      <v-tabs
        v-model="currentActivePage"
        color="primary"
        direction="vertical"
        @update:modelValue="changeActivePage"
      >
        <v-tab
          v-for="page in props.pages"
          :key="page.id"
          :text="page.title"
          :value="page"
        ></v-tab>
      </v-tabs>
      <v-btn
        :disabled="isDisabled()"
        class="ml-5 mt-10"
        color="primary"
        @click="displaySubDiaglog"
        >Submit Application</v-btn
      >
    </v-navigation-drawer>
  </div>
</template>
