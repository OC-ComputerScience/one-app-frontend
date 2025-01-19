<script setup>
import StudentFieldEntry from "./StudentFieldEntry.vue";
import AppFieldValueServices from "./../../services/AppFieldValueServices.js";

import { computed, onMounted, onBeforeUpdate, ref, watch } from "vue";

const props = defineProps(["pageGroup", "applicationId"]);
const emit = defineEmits(["revalidateApp"]);
const pgComplete = ref([]);
const numCol = ref("1");

const canremoveGroups = computed(() => {
  return props.pageGroup.numGroups > props.pageGroup.minSetCount;
});

const findSetNumber = (index) => {
  try {
    let setNumber =
      props.pageGroup.fieldPageGroups[0].field.appFieldValues[index].setNumber;
    console.log("setNumber=" + setNumber);
    return setNumber;
  } catch (error) {
    console.log(error);
    console.log("Error in findSetNumber=1");
    return 1;
  }

  return setNumber;
};

const revalidateGroup = (fieldPageGroupId, value, setNumber) => {
  for (let i = 0; i < props.pageGroup.numGroups; i++) {
    pgComplete.value[i] = true;

    props.pageGroup.fieldPageGroups.forEach((fpg) => {
      // if fieldPageGroupId not null, then we are updating the field value
      if (fieldPageGroupId != null) {
        fpg.field.appFieldValues.sort((a, b) => {
          return a.setNumber - b.setNumber;
        });
        fpg.isComplete = true;
        let index = fpg.field.appFieldValues.findIndex(
          (fieldValue) => fieldValue.setNumber === setNumber
        );
        if (index === -1) {
          fpg.field.appFieldValues.push({
            setNumber: setNumber,
            fieldValueName: null,
          });
          index = fpg.field.appFieldValues.length - 1;
        }
        if (fpg.id == fieldPageGroupId) {
          fpg.field.appFieldValues[index].fieldValueName = value;
        }
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
  console.log(props.pageGroup.numGroups);
  console.log(props.pageGroup.maxSetCount);
  return isLessThanMax && isAtLeastMin;
});

const addPageGroup = () => {
  props.pageGroup.fieldPageGroups.forEach((fieldPageGroup) => {
    let maxSet = 0;
    fieldPageGroup.field.appFieldValues.forEach((fieldValue) => {
      if (fieldValue.setNumber > maxSet) {
        maxSet = fieldValue.setNumber;
      }
    });
    fieldPageGroup.field.appFieldValues.push({
      setNumber: maxSet + 1,
      fieldValueName: null,
    });
  });

  props.pageGroup.numGroups++;
};
const removePageGroup = async (index) => {
  let setNumber = findSetNumber(index);

  props.pageGroup.fieldPageGroups.forEach(async (fieldPageGroup) => {
    fieldPageGroup.field.appFieldValues =
      fieldPageGroup.field.appFieldValues.filter(
        (fieldValue) => fieldValue.setNumber !== setNumber
      );

    await AppFieldValueServices.deleteAppFieldValuesForAppSet(
      fieldPageGroup.field.id,
      props.applicationId,
      setNumber
    );
  });
  console.log("removePageGroup");
  console.log(props.pageGroup);
  props.pageGroup.numGroups--;
};

watch(
  () => props.pageGroup,
  (first, second) => {
    revalidateGroup(null, null, null);
  }
);

onMounted(() => {
  revalidateGroup(null, null, null);
});
</script>

<template>
  <v-card
    v-for="(index, counter) in pageGroup.numGroups"
    :key="index"
    class="mt-4"
  >
    <v-toolbar>
      <v-toolbar-title> {{ pageGroup.title }} {{ index }} </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        color="primary"
        @click="removePageGroup(counter)"
        v-if="canremoveGroups"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      {{ pageGroup.text }}
      <div
        v-if="pgComplete[index - 1]"
        class="mt-3 font-italic font-weight-medium"
      >
        All required fields are completed
      </div>

      <div v-if="!pgComplete[index - 1]" class="mt-3 font-italic text-red">
        All required fields are not completed
      </div>

      <div v-if="pageGroup.displayType === 'Vertical'" class="mt-3">
        <v-row v-for="fieldPageGroup in pageGroup.fieldPageGroups">
          <v-col cols="12" md="4" sm="6">
            <StudentFieldEntry
              :key="fieldPageGroup.id"
              :field-page-group="fieldPageGroup"
              :applicationId="applicationId"
              :set-number="findSetNumber(counter)"
              @updatedField="revalidateGroup"
            />
          </v-col>
        </v-row>
      </div>
      <div v-if="pageGroup.displayType === 'Horizontal'" class="mt-3">
        <v-row class="mt-3">
          <v-col
            cols="12"
            md="4"
            sm="6"
            v-for="fieldPageGroup in pageGroup.fieldPageGroups"
            :key="fieldPageGroup.id"
          >
            <StudentFieldEntry
              :key="fieldPageGroup.id"
              :field-page-group="fieldPageGroup"
              :applicationId="applicationId"
              :set-number="findSetNumber(counter)"
              @updatedField="revalidateGroup"
            />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
  <v-btn
    v-if="canAddGroups"
    rounded="xl"
    color="primary"
    class="mt-4"
    @click="addPageGroup"
    >+ {{ pageGroup.title }}</v-btn
  >
</template>
