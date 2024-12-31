<script setup>
import StudentFieldEntry from "./StudentFieldEntry.vue";

import { computed, onMounted, ref, watch } from "vue";

const props = defineProps(["pageGroup", "applicationId"]);
const emit = defineEmits(["revalidateApp"]);
const pgComplete = ref([]);

const revalidateGroup = (fieldPageGroupId, value, setNumber) => {
  for (let i = 0; i < props.pageGroup.numGroups; i++) {
    pgComplete.value[i] = true;

    props.pageGroup.fieldPageGroups.forEach((fpg) => {
      fpg.field.appFieldValues.sort((a, b) => {
        return a.setNumber - b.setNumber;
      });
      fpg.isComplete = true;
      if (fpg.id == fieldPageGroupId) {
        if (fpg.field.appFieldValues.length < setNumber) {
          fpg.field.appFieldValues[setNumber - 1] = {};
          fpg.field.appFieldValues[setNumber - 1].setNumber = 1;
          fpg.field.appFieldValues[setNumber - 1].fieldValueName = null;
        }
        fpg.field.appFieldValues[setNumber - 1].fieldValueName = value;
      }
      if (fpg.field.isRequired) {
        if (fpg.field.appFieldValues[i] != null) {
          if (
            fpg.field.appFieldValues[i].fieldValueName == null ||
            fpg.field.appFieldValues[i].fieldValueName == ""
          ) {
            props.pageGroup.isComplete = false;
            fpg.isComplete = false;
            pgComplete.value[i] = false;
          }
        } else {
          props.pageGroup.isComplete = false;
          fpg.isComplete = false;
          pgComplete.value[i] = false;
        }
      }
    });
  }
  emit("revalidateApp");
};

const canAddGroups = computed(() => {
  let isLessThanMax = props.pageGroup.numGroups < props.pageGroup.maxSetCount;
  let isAtLeastMin = props.pageGroup.numGroups >= props.pageGroup.minSetCount;
  return isLessThanMax && isAtLeastMin;
});

const addPageGroup = () => {
  props.pageGroup.numGroups++;
};

onMounted(() => {
  revalidateGroup(null, null, null);
});

watch(
  () => props.pageGroup,
  (first, second) => {
    revalidateGroup(null, null, null);
  }
);
</script>

<template>
  <v-card v-for="index in props.pageGroup.numGroups" :key="index" class="mt-4">
    <v-toolbar>
      <v-toolbar-title> {{ props.pageGroup.title }} </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      {{ props.pageGroup.text }}
      <div
        v-if="pgComplete[index - 1]"
        class="mt-3 font-italic font-weight-medium"
      >
        All required fields are completed
      </div>

      <div v-if="!pgComplete[index - 1]" class="mt-3 font-italic text-red">
        All required fields are not completed
      </div>
      <v-row class="mt-3">
        <v-col
          cols="12"
          md="4"
          sm="6"
          v-for="fieldPageGroup in props.pageGroup.fieldPageGroups"
          :key="fieldPageGroup.id"
        >
          <StudentFieldEntry
            :field-page-group="fieldPageGroup"
            :applicationId="applicationId"
            :set-number="index"
            @updatedField="revalidateGroup"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-btn
    v-if="canAddGroups"
    icon="mdi-plus"
    color="primary"
    class="mt-2"
    @click="addPageGroup"
  ></v-btn>
</template>
