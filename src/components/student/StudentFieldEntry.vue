<script setup>
import states from "../../config/states";
import countries from "../../config/countries";
import majors from "../../config/majors";
import AppFieldValueServices from "../../services/AppFieldValueServices";
import { watch } from "vue";
//import { VDateInput } from "vuetify/labs/VDateInput";
import { ref, defineEmits, onBeforeUpdate, onMounted } from "vue";

const props = defineProps(["fieldPageGroup", "applicationId", "setNumber"]);

const emits = defineEmits(["updatedField"]);

const appFieldValue = ref({
  id: null,
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
const displayFieldlName = ref("");

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
const changeAutoListFieldValue = (value) => {
  if (value == null) {
    appFieldValue.value.fieldValueName = "";
    return;
  }
  appFieldValue.value.fieldValueName = value.value;
};

const saveFieldValue = async () => {
  if (type.value == "Date")
    if (dateFieldValue.value != null)
      appFieldValue.value.fieldValueName =
        dateFieldValue.value.toLocaleDateString();
    else appFieldValue.value.fieldValueName = "";

  if (appFieldValue.value.id) {
    await updateFieldValue();
    emits(
      "updatedField",
      props.fieldPageGroup.field.id,
      appFieldValue.value.fieldValueName,
      props.setNumber
    );
  } else {
    await saveNewFieldValue();
    emits(
      "updatedField",
      props.fieldPageGroup.field.id,
      appFieldValue.value.fieldValueName,
      props.setNumber
    );
  }
};

const saveNewFieldValue = async () => {
  try {
    appFieldValue.value.applicationId = props.applicationId;
    appFieldValue.value.fieldId = props.fieldPageGroup.field.id;
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

const initializeAppFieldValue = () => {
  type.value = props.fieldPageGroup.field.type;
  required.value = props.fieldPageGroup.field.isRequired;
  appFieldValue.value.fieldId = props.fieldPageGroup.fieldId;
  displayFieldlName.value = props.fieldPageGroup.field.name;

  if (props.fieldPageGroup.field.isRequired) {
    displayFieldlName.value = displayFieldlName.value + " *";
  }

  if (props.fieldPageGroup.field.appFieldValues.length > 0) {
    let value = props.fieldPageGroup.field.appFieldValues.find(
      (appFieldValue) => {
        return appFieldValue.setNumber === props.setNumber;
      }
    );
    if (value) appFieldValue.value = value;
    console.log("appFieldValue=" + appFieldValue.value);
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
  } else if (type.value === "Country") {
    fieldValues.value = countries.countries;
    selectedFieldValue.value = appFieldValue.value.fieldValueName;
  } else if (type.value === "Major") {
    fieldValues.value = majors.majors;
    selectedFieldValue.value = appFieldValue.value.fieldValueName;
  } else if (type.value === "State") {
    fieldValues.value = states.states;
    selectedFieldValue.value = appFieldValue.value.fieldValueName;
  } else if (type.value === "Date") {
    if (appFieldValue.value.fieldValueName == "") dateFieldValue.value = null;
    else dateFieldValue.value = new Date(appFieldValue.value.fieldValueName);
  }
};
watch(
  () => props.fieldPageGroup,
  (first, second) => {
    initializeAppFieldValue();
  },
  { deep: true }
);

onMounted(() => {
  initializeAppFieldValue();
});
</script>

<template>
  {{ props.setNumber }} - {{ appFieldValue.applicationId }}
  <div v-if="type === 'Checkbox'" class="mt-n2">
    <v-checkbox
      v-model="appFieldValue.fieldValueName"
      :label="displayFieldlName"
      @update:modelValue="saveFieldValue"
      :rules="required ? rules.general : []"
    ></v-checkbox>
  </div>
  <div v-else-if="type === 'Date'">
    <v-date-input
      v-model="dateFieldValue"
      variant="outlined"
      density="compact"
      :label="displayFieldlName"
      :placeholder="props.fieldPageGroup.field.placeholderText"
      v-on:blur="saveFieldValue"
      :rules="required ? rules.general : []"
    ></v-date-input>
  </div>
  <div v-else-if="type === 'Dropdown'">
    <v-autocomplete
      v-model="selectedFieldValue"
      :items="fieldValues"
      :label="displayFieldlName"
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
  <div v-else-if="type === 'State' || type === 'Country' || type === 'Major'">
    <v-autocomplete
      v-model="selectedFieldValue"
      :items="fieldValues"
      :label="displayFieldlName"
      :placeholder="props.fieldPageGroup.field.placeholderText"
      item-title="value"
      variant="outlined"
      density="compact"
      return-object
      @update:modelValue="changeAutoListFieldValue(selectedFieldValue)"
      v-on:blur="saveFieldValue()"
      :rules="required ? rules.general : []"
    ></v-autocomplete>
  </div>
  <div
    v-else-if="type === 'Email' || type === 'Phone Number' || type === 'Text'"
  >
    <v-text-field
      v-model="appFieldValue.fieldValueName"
      :label="displayFieldlName"
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
      :label="displayFieldlName"
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
      :label="displayFieldlName"
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
