<script setup>
import StudentFieldEntry from "./StudentFieldEntry.vue";
import { computed, defineEmits } from "vue";

const props = defineProps(["pageGroup", "applicationId"]);
const emit = defineEmits(["revalidateApp"]);

const revalidateGroup = (fieldPageGroupId, value, index) => {
  props.pageGroup.isComplete = true;

  props.pageGroup.fieldPageGroups.forEach((fpg) => {
    if (fpg.id == fieldPageGroupId) {
      fpg.field.appFieldValues[index - 1].fieldValueName = value;
    }
    if (fpg.field.isRequired) {
      fpg.field.appFieldValues.forEach((afv) => {
        if (afv.fieldValueName == null || afv.fieldValueName == "") {
          props.pageGroup.isComplete = false;
        }
      });
    }
  });

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
</script>

<template>
  <v-card v-for="index in props.pageGroup.numGroups" :key="index" class="mt-4">
    <v-toolbar>
      <v-toolbar-title> {{ props.pageGroup.title }} </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      {{ props.pageGroup.text }}
      <div
        v-if="pageGroup.isComplete"
        class="mt-3 font-italic font-weight-medium"
      >
        All required fields are completed
      </div>
      <div v-if="!pageGroup.isComplete" class="mt-3 font-italic text-red">
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
