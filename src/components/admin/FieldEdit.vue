<script setup>
import { ref, onMounted, computed } from "vue";
import FieldServices from "../../services/FieldServices";
import FieldValueServices from "../../services/FieldValueServices";

const props = defineProps(["field"]);
const emits = defineEmits(["closeDialog", "saveField"]);

const dialogTitle = computed(() => {
  return props.field.name === "" ? "New Field" : "Edit Field";
});

const form = ref(null);
const editMode = ref(false);
const showFieldValues = ref(false);
const fieldValues = ref([]);
const originalFieldValues = ref([]);
const fieldTypes = ref([
  "Checkbox",
  "Country",
  "Date",
  "Dropdown",
  "Email",
  "Number",
  "Major",
  "Paragraph",
  "Phone Number",
  "Radio",
  "State",
  "Text",
]);
const defaultFields = ref([
  "First Name",
  "Last Name",
  "Email",
  "Phone Number",
  "Street Address",
  "City",
  "State",
  "Zip Code",
  "Graduation Year",
]);

const closeDialog = () => {
  emits("closeDialog");
};

const checkFieldType = () => {
  if (props.field.type === "Dropdown" || props.field.type === "Radio") {
    showFieldValues.value = true;
  }
};

const addFieldValue = () => {
  fieldValues.value.push({
    value: "",
  });
};

const saveField = async () => {
  let response;
  try {
    if (editMode.value) {
      await FieldServices.updateFields(props.field);
      response = { data: props.field };
    } else {
      response = await FieldServices.addFields(props.field);
    }
    if (originalFieldValues.value.length > 0 || fieldValues.value.length > 0) {
      await saveFieldValues(response.data.id);
    }
  } catch (err) {
    console.error(err);
  } finally {
    emits("saveField", response.data);
  }
};

const saveFieldValues = async (fieldId) => {
  try {
    const valuesToDelete = originalFieldValues.value.filter(
      (original) =>
        !fieldValues.value.some((current) => current.id === original.id)
    );

    await Promise.all(
      valuesToDelete.map((value) =>
        FieldValueServices.deleteFieldValues(value.id)
      )
    );

    if (fieldValues.value.length > 0) {
      for (let i = 0; i < fieldValues.value.length; i++) {
        if (fieldValues.value[i].id) {
          await FieldValueServices.updateFieldValues(fieldValues.value[i]);
        } else {
          fieldValues.value[i].fieldId = fieldId;
          await FieldValueServices.addFieldValues(fieldValues.value[i]);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const fetchFieldValues = async () => {
  try {
    let response = await FieldValueServices.getFieldValuesByField(
      props.field.id
    );
    fieldValues.value = response.data;
    originalFieldValues.value = JSON.parse(JSON.stringify(response.data));
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  if (props.field.name !== "") {
    editMode.value = true;
  }
  if (props.field.type === "Dropdown" || props.field.type === "Radio") {
    showFieldValues.value = true;
    await fetchFieldValues();
  }
});
</script>
<template>
  <v-card>
    <v-card-title> {{ dialogTitle }} </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-form v-model="form" class="ml-4 mr-4">
        <v-text-field
          v-model="props.field.name"
          label="Name*"
          variant="outlined"
          :rules="[(v) => !!v || 'Name is required']"
          required
          density="compact"
        ></v-text-field>
        <v-text-field
          v-model="props.field.description"
          label="Description"
          variant="outlined"
          density="compact"
        ></v-text-field>
        <v-text-field
          v-model="props.field.placeholderText"
          label="Placeholder Text"
          variant="outlined"
          density="compact"
        ></v-text-field>
        <v-checkbox
          color="primary"
          class="mt-n4"
          label="Required"
          v-model="props.field.isRequired"
        ></v-checkbox>

        <v-checkbox
          color="primary"
          class="mt-n4"
          label="Encrypted"
          v-model="props.field.isEncrypted"
        ></v-checkbox>
        <v-autocomplete
          class="mt-n4 mb-2"
          label="Field Type*"
          variant="outlined"
          v-model="props.field.type"
          density="compact"
          :items="fieldTypes"
          :rules="[(v) => !!v || 'Field type is required']"
          required
          @update:modelValue="checkFieldType"
        ></v-autocomplete>
        <v-checkbox
          v-if="props.field.type === 'Dropdown' || props.field.type === 'Radio'"
          color="primary"
          class="mt-n4"
          label="Sorted"
          v-model="props.field.sorted"
        ></v-checkbox>
        <v-text-field
          v-if="props.field.type === 'Text'"
          v-model="props.field.mask"
          label="Field Mask"
          variant="outlined"
          density="compact"
        ></v-text-field>
        <v-autocomplete
          class="mt-n4 mb-2"
          label="Default Field"
          variant="outlined"
          v-model="props.field.defaultField"
          density="compact"
          :items="defaultFields"
        ></v-autocomplete>
        <div v-if="showFieldValues">
          <v-row
            v-for="(fieldValue, index) in fieldValues"
            :key="index"
            class="mr-1 mt-n6"
          >
            <v-col cols="12" md="11">
              <v-text-field
                v-model="fieldValue.value"
                label="Field Value*"
                variant="outlined"
                :rules="[(v) => !!v || 'Field value is required']"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="1">
              <v-icon
                class="mt-2"
                color="accent"
                icon="mdi-trash-can-outline"
                density="comfortable"
                @click="fieldValues.splice(index, 1)"
              ></v-icon>
            </v-col>
          </v-row>

          <v-btn
            color="primary"
            icon="mdi-plus"
            density="comfortable"
            @click="addFieldValue"
          ></v-btn>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions align="right" class="mr-2 mb-2">
      <v-btn
        variant="plain"
        elevation="0"
        density="comfortable"
        @click="closeDialog"
        color="accent"
      >
        Cancel
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!form"
        variant="outlined"
        elevation="0"
        density="comfortable"
        @click="saveField"
        color="primary"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
