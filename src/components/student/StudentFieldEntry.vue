<script setup>
import store from "../../store/store";
import states from "../../config/states";
import countries from "../../config/countries";
import majors from "../../config/majors";
import AppFieldValueServices from "../../services/AppFieldValueServices";
import { watch } from "vue";
import { vMaska } from "maska/vue";
import { ref, defineEmits, onBeforeUpdate, onMounted } from "vue";
import UserServices from "../../services/UserServices";

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
const user = ref(null);

user.value = store.getters.getUser;

const rules = {
  email: [
    (v) => !!v || "Email is required",
    (v) => /.+@.+\..+/.test(v) || "Email must be valid",
  ],

  text: [
    (v) => !!v || "This field is required",
    (v) => (v && v.length <= 100) || "Text must be less than 100 characters",
  ],
  general: [(v) => !!v || "This field is required"],
};

const changeFieldValue = (value) => {
  appFieldValue.value.fieldValueId = value ? value.id : null;
  appFieldValue.value.fieldValueName = value ? value.value : null;
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

const getFieldDefaultValue = () => {
  if (props.fieldPageGroup.field.defaultField == null) return null;
  try {
    if (props.fieldPageGroup.field.defaultField === "First Name") {
      return user.value.firstName;
    } else if (props.fieldPageGroup.field.defaultField === "Last Name") {
      return user.value.lastName;
    } else if (props.fieldPageGroup.field.defaultField === "Email") {
      return user.value.email;
    } else if (props.fieldPageGroup.field.defaultField === "Phone Number") {
      return user.value.phone;
    } else if (props.fieldPageGroup.field.defaultField === "Street Address") {
      return user.value.streetAddress;
    } else if (props.fieldPageGroup.field.defaultField === "City") {
      return user.value.city;
    } else if (props.fieldPageGroup.field.defaultField === "Zip Code") {
      return user.value.zip;
    } else if (props.fieldPageGroup.field.defaultField === "Graduation Year") {
      return user.value.hsgradyear;
    } else if (props.fieldPageGroup.field.defaultField === "State") {
      return user.value.state;
    }
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
  if (
    props.fieldPageGroup.field.defaultField !== null &&
    props.fieldPageGroup.field.appFieldValues.length === 0 &&
    (appFieldValue.value.fieldValueName === "" ||
      appFieldValue.value.fieldValueName === null)
  ) {
    appFieldValue.value.fieldValueName = getFieldDefaultValue();
    let defaultFieldValue = null;
    if (type.value === "Dropdown" || type.value === "Radio") {
      defaultFieldValue = props.fieldPageGroup.field.fieldValues.find(
        (fieldValue) => {
          return fieldValue.value === appFieldValue.value.fieldValueName;
        }
      );
      if (defaultFieldValue !== null)
        appFieldValue.value.fieldValueId = defaultFieldValue.id;
    }
    // save default value to database
    saveFieldValue();
  }

  if (props.fieldPageGroup.field.appFieldValues.length > 0) {
    console.log("get prev appFieldValues");
    let value = props.fieldPageGroup.field.appFieldValues.find(
      (appFieldValue) => {
        return appFieldValue.setNumber === props.setNumber;
      }
    );

    if (value) appFieldValue.value = value;
  } else {
    appFieldValue.value.setNumber = props.setNumber;
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
    <v-select
      clearable
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
    ></v-select>
  </div>
  <div v-else-if="type === 'State' || type === 'Country' || type === 'Major'">
    <v-select
      clearable
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
    ></v-select>
  </div>
  <div v-else-if="type === 'Email' || type === 'Text'">
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
      :type="type === 'Email' ? 'email' : 'text'"
      variant="outlined"
      density="compact"
      v-on:blur="saveFieldValue"
    ></v-text-field>
  </div>
  <div v-else-if="type === 'Phone Number'">
    <v-text-field
      v-model="appFieldValue.fieldValueName"
      :label="displayFieldlName"
      v-maska="'(###) ###-####'"
      :placeholder="props.fieldPageGroup.field.placeholderText"
      :rules="[required]"
      type="tel"
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
