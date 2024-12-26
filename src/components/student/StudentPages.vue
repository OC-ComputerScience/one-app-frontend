<script setup>
import { ref, onMounted, onUpdated } from "vue";

const props = defineProps(["pages", "activePage"]);
const emit = defineEmits(["changeActivePage", "displaySubDiaglog"]);

const activePage = ref({});

const changeActivePage = () => {
  emit("changeActivePage", activePage.value);
};
const displaySubDiaglog = () => {
  emit("displaySubDiaglog");
};

onMounted(() => {
  activePage.value = props.activePage;
});

onUpdated(() => {
  activePage.value = props.activePage;
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
        v-model="activePage"
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
      <v-btn class="ml-5 mt-10" color="primary" @click="displaySubDiaglog"
        >Submit Application</v-btn
      >
    </v-navigation-drawer>
  </div>
</template>
