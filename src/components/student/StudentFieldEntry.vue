<script setup>
import states from "../../config/states";
import AppFieldValueServices from "../../services/AppFieldValueServices";
//import { VDateInput } from "vuetify/labs/VDateInput";
import { ref, defineEmits, onMounted } from "vue";

const props = defineProps(["fieldPageGroup", "applicationId", "setNumber"]);
const emit = defineEmits(["updatedField"]);

const appFieldValue = ref({
  applicationId: props.applicationId,
  setNumber: props.setNumber,
  fieldId: null,
  fieldValueId: null,
  fieldValueName: "",
});
const fieldValues = ref([]);
const selectedFieldValue = ref(null);
const dateFieldValue = ref(null);
const type = ref("");
const required = ref(false);

const rules = {
  email: [
    (v) => !!v || "Email is required",
    (v) => /.+@.+\..+/.test(v) || "Email must be valid",
  ],
  phone: [
    (v) => !!v || "Phone number is required",
    (v) =>
      /^\+?[\d\s-]{10,}$/.test(v) ||
      "Phone number must be valid (minimum 10 digits)",
  ],
  text: [
    (v) => !!v || "This field is required",
    (v) => (v && v.length <= 100) || "Text must be less than 100 characters",
  ],
  general: [(v) => !!v || "This field is required"],
};

const changeFieldValue = (value) => {
  appFieldValue.value.fieldValueId = value.id;
  appFieldValue.value.fieldValueName = value.value;
};

const saveFieldValue = async () => {
  if (type.value == "Date")
    if (dateFieldValue.value != null)
      appFieldValue.value.fieldValueName =
        dateFieldValue.value.toLocaleDateString();
    else appFieldValue.value.fieldValueName = "";

  // if (appFieldValue.value.fieldValueName === "") {
  //   return;
  //}
  if (appFieldValue.value.id) {
    await updateFieldValue();
    emit(
      "updatedField",
      props.fieldPageGroup.id,
      appFieldValue.value.fieldValueName,
      props.setNumber
    );
  } else {
    await saveNewFieldValue();
    emit(
      "updatedField",
      props.fieldPageGroup.id,
      appFieldValue.value.fieldValueName,
      props.setNumber
    );
  }
};

const saveNewFieldValue = async () => {
  try {
    const response = await AppFieldValueServices.addAppFieldValues(
      appFieldValue.value
    );
    appFieldValue.value.id = response.data.id;
  } catch (err) {
    console.error(err);
  }
};

const updateFieldValue = async () => {
  if (
    appFieldValue.value.fieldValueName ===
    props.fieldPageGroup.field.appFieldValues.fieldValueName
  ) {
    return;
  }
  try {
    await AppFieldValueServices.updateAppFieldValues(appFieldValue.value);
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  type.value = props.fieldPageGroup.field.type;
  required.value = props.fieldPageGroup.field.isRequired;
  appFieldValue.value.fieldId = props.fieldPageGroup.field.id;

  if (props.fieldPageGroup.field.appFieldValues.length > 0) {
    let value = props.fieldPageGroup.field.appFieldValues.find(
      (appFieldValue) => {
        return appFieldValue.setNumber === props.setNumber;
      }
    );
    if (value) appFieldValue.value = value;
  }
  if (type.value === "Dropdown" || type.value === "Radio") {
    fieldValues.value = props.fieldPageGroup.field.fieldValues;
    if (appFieldValue.value.fieldValueId !== null) {
      selectedFieldValue.value = fieldValues.value.find((fieldValue) => {
        return fieldValue.id === appFieldValue.value.fieldValueId;
      });
    }
  } else if (type.value === "Checkbox") {
    appFieldValue.value.fieldValueName =
      appFieldValue.value.fieldValueName === "1" ? true : false;
  } else if (type.value === "State") {
    fieldValues.value = states.states;
    selectedFieldValue.value = appFieldValue.value.fieldValueName;
  } else if (type.value === "Date") {
    if (appFieldValue.value.fieldValueName == "") dateFieldValue.value = null;
    else dateFieldValue.value = new Date(appFieldValue.value.fieldValueName);
  }
});
</script>

<template>
  <div v-if="type === 'Checkbox'" class="mt-n2">
    <v-checkbox
      v-model="appFieldValue.fieldValueName"
      :label="props.fieldPageGroup.field.name"
      @update:modelValue="saveFieldValue"
      :rules="required ? rules.general : []"
    ></v-checkbox>
  </div>
  <div v-else-if="type === 'Date'">
    <v-date-input
      v-model="dateFieldValue"
      variant="outlined"
      density="compact"
      :label="props.fieldPageGroup.field.name"
      :placeholder="props.fieldPageGroup.field.placeholderText"
      v-on:blur="saveFieldValue"
      :rules="required ? rules.general : []"
    ></v-date-input>
  </div>
  <div v-else-if="type === 'Dropdown' || type === 'State'">
    <v-autocomplete
      v-model="selectedFieldValue"
      :items="fieldValues"
      :label="props.fieldPageGroup.field.name"
      :placeholder="props.fieldPageGroup.field.placeholderText"
      item-title="value"
      variant="outlined"
      density="compact"
      return-object
      @update:modelValue="changeFieldValue(selectedFieldValue)"
      v-on:blur="saveFieldValue()"
      :rules="required ? rules.general : []"
    ></v-autocomplete>
  </div>
  <div
    v-else-if="type === 'Email' || type === 'Phone Number' || type === 'Text'"
  >
    <v-text-field
      v-model="appFieldValue.fieldValueName"
      :label="props.fieldPageGroup.field.name"
      :placeholder="props.fieldPageGroup.field.placeholderText"
      :rules="
        type === 'Email' && required
          ? rules.email
          : type === 'Phone Number' && required
          ? rules.phone
          : required
          ? rules.text
          : []
      "
      :type="
        type === 'Email' ? 'email' : type === 'Phone Number' ? 'tel' : 'text'
      "
      variant="outlined"
      density="compact"
      v-on:blur="saveFieldValue"
    ></v-text-field>
  </div>
  <div v-else-if="type === 'Number'">
    <v-text-field
      v-model="appFieldValue.fieldValueName"
      :label="props.fieldPageGroup.field.name"
      :placeholder="props.fieldPageGroup.field.placeholderText"
      type="number"
      variant="outlined"
      density="compact"
      v-on:blur="saveFieldValue"
      :rules="required ? rules.general : []"
    ></v-text-field>
  </div>
  <div v-else-if="type === 'Paragraph'">
    <v-textarea
      v-model="appFieldValue.fieldValueName"
      :label="props.fieldPageGroup.field.name"
      :placeholder="props.fieldPageGroup.field.placeholderText"
      variant="outlined"
      density="compact"
      v-on:blur="saveFieldValue"
      :rules="required ? rules.general : []"
    ></v-textarea>
  </div>
  <div v-else-if="type === 'Radio'">
    <v-radio-group
      v-model="appFieldValue.fieldValueName"
      :label="props.fieldPageGroup.field.name"
      :rules="required ? rules.general : []"
      @update:modelValue="saveFieldValue"
    >
      <v-radio
        v-for="fieldValue in fieldValues"
        :key="fieldValue.id"
        :label="fieldValue.value"
        :value="fieldValue.value"
      ></v-radio>
    </v-radio-group>
  </div>
</template>
