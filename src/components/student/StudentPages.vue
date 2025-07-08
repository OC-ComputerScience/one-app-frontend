<script setup>
import { ref, onMounted, onUpdated, computed } from "vue";

const props = defineProps(["pages", "activePage", "application"]);
const emit = defineEmits(["changeActivePage", "displaySubDiaglog"]);

const currentActivePage = ref({});
const pageIsComplete = ref([]);

const getIcon = (page) => {
  const icon =
    page.isComplete === "Completed" ? "mdi-check" : "mdi-alert-circle-outline";

  return icon;
};

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
        <v-tab v-for="page in props.pages" :key="page.id" :value="page">
          <div class="d-flex align-center">
            <v-icon
              :icon="getIcon(page)"
              :color="page.isComplete === 'Completed' ? 'primary' : 'error'"
              class="mr-2"
            />
            <span>{{ page.title }}</span>
          </div>
        </v-tab>
      </v-tabs>
      <v-btn
        :disabled="isDisabled()"
        class="ml-5 mt-10"
        color="primary"
        @click="displaySubDiaglog"
      >
        <v-icon icon="mdi-send" class="mr-2" />
        Submit Application
      </v-btn>
    </v-navigation-drawer>
  </div>
</template>
