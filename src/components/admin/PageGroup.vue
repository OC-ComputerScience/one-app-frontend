<script setup>
import { ref, computed, onMounted, onUpdated } from "vue";
import PageGroupServices from "../../services/PageGroupServices";
import FieldTable from "./FieldTable.vue";
import FieldEdit from "./FieldEdit.vue";
import FieldPageGroupServices from "../../services/FieldPageGroupServices";
import ConfirmDelete from "../ConfirmDelete.vue";

const props = defineProps(["pageGroup", "numGroups"]);
const emits = defineEmits(["updateGroupSequence", "deleteGroup"]);
const editingTitle = ref(false);
const groupValueChanged = ref(false);
const currentGroupSequence = ref(null);
const newFieldDialog = ref(false);
const confirmDelete = ref(false);
const displayTypes = ref(["Vertical", "Horizontal"]);
const snackbar = ref(false);
const snackbarText = ref("");
const activeField = ref({
  name: "",
  label: "",
  description: "",
  type: "",
  placeholderText: "",
  isRequired: false,
  isEncrypted: false,
  defaultValue: "",
});

const groupSequences = computed(() => {
  let sequences = [];
  for (let i = 1; i <= props.numGroups; i++) {
    sequences.push(i);
  }
  return sequences;
});

const updateGroup = async (changed) => {
  editingTitle.value = false;
  if (changed) {
    groupValueChanged.value = true;
  }
  if (!groupValueChanged.value) {
    return;
  }
  try {
    await PageGroupServices.updatePageGroups(props.pageGroup);
    snackbarText.value = "Group Updated Successfully";
  } catch (err) {
    console.error(err);
    snackbarText.value = "Failed to update group";
  } finally {
    snackbar.value = true;
    groupValueChanged.value = false;
  }
};

const deleteGroup = async () => {
  try {
    await PageGroupServices.deletePageGroups(props.pageGroup.id);
    emits("deleteGroup", props.pageGroup);
    snackbarText.value = "Group Deleted Successfully";
  } catch (err) {
    console.error(err);
    snackbarText.value = "Failed to delete group";
  } finally {
    confirmDelete.value = false;
    snackbar.value = true;
  }
};

const updateGroupSequence = () => {
  emits(
    "updateGroupSequence",
    currentGroupSequence.value - 1,
    props.pageGroup.groupSequence
  );
};

const updateMaxSetCount = () => {
  if (props.pageGroup.maxSetCount < props.pageGroup.minSetCount) {
    props.pageGroup.maxSetCount = props.pageGroup.minSetCount;
  } else updateGroupWithDelay();
};

const updateMinSetCount = () => {
  if (props.pageGroup.minSetCount > props.pageGroup.maxSetCount) {
    props.pageGroup.minSetCount = props.pageGroup.maxSetCount;
  } else updateGroupWithDelay();
};
let updateTimer = null;
const updateGroupWithDelay = () => {
  if (updateTimer) {
    clearTimeout(updateTimer);
  }
  updateTimer = setTimeout(() => {
    updateGroup(true);
  }, 2000);
};

const addNewField = () => {
  activeField.value.fieldSequence = props.pageGroup.fieldPageGroups.length;
  newFieldDialog.value = true;
};

const editField = (field) => {
  activeField.value = JSON.parse(JSON.stringify(field));
  newFieldDialog.value = true;
};

const saveNewField = async (newField) => {
  let activeFieldPageGroup = props.pageGroup.fieldPageGroups.find(
    (fieldPageGroup) => {
      return fieldPageGroup.fieldId === activeField.value.id;
    }
  );
  if (activeFieldPageGroup) {
    activeFieldPageGroup.field = newField;
  } else {
    await createFieldPageGroup(newField, props.pageGroup.id);
  }
  closeFieldDialog();
};

const createFieldPageGroup = async (field, pageGroupId) => {
  let newFieldPageGroup = {
    fieldId: field.id,
    pageGroupId: pageGroupId,
    pageId: props.pageGroup.pageId,
    sequenceNumber: props.pageGroup.fieldPageGroups.length,
  };
  try {
    let response = await FieldPageGroupServices.addFieldPageGroups(
      newFieldPageGroup
    );
    newFieldPageGroup = response.data;
    newFieldPageGroup.field = field;
    props.pageGroup.fieldPageGroups.push(newFieldPageGroup);
    snackbarText.value = "Field Added Successfully";
  } catch (err) {
    console.error(err);
    snackbarText.value = "Failed to add field";
  } finally {
    snackbar.value = true;
  }
};

const closeFieldDialog = () => {
  activeField.value = {
    name: "",
    label: "",
    description: "",
    type: "",
    placeholderText: "",
    fieldSequence: null,
    isRequired: false,
    isEncrypted: false,
    defaultValue: "",
  };
  newFieldDialog.value = false;
};

onMounted(() => {
  currentGroupSequence.value = Number(props.pageGroup.groupSequence) + 1;
});

onUpdated(() => {
  currentGroupSequence.value = Number(props.pageGroup.groupSequence) + 1;
});
</script>

<template>
  <div>
    <v-card elevation="1" class="ml-7 mr-7" variant="elevated">
      <v-toolbar>
        <v-row v-if="!editingTitle">
          <v-col cols="12" md="6" sm="6">
            <v-toolbar-title>
              <v-btn
                icon="mdi-pencil"
                color="icons"
                @click="
                  () => {
                    editingTitle = true;
                  }
                "
              ></v-btn>
              {{ props.pageGroup.title }}
            </v-toolbar-title>
          </v-col>
          <v-col cols="12" md="6" sm="6" align="right">
            <v-btn
              class="mr-2"
              icon="mdi-trash-can-outline"
              color="icons"
              @click="
                () => {
                  confirmDelete = true;
                }
              "
            ></v-btn>
          </v-col>
        </v-row>
        <v-row v-if="editingTitle">
          <v-col cols="12" md="4">
            <v-text-field
              class="ml-4 mt-6"
              v-model="props.pageGroup.title"
              variant="outlined"
              label="Group Title"
              density="compact"
              v-on:blur="updateGroup(false)"
              @update:modelValue="
                () => {
                  groupValueChanged = true;
                }
              "
            ></v-text-field>
          </v-col>
        </v-row>
      </v-toolbar>
      <v-row class="ma-2">
        <v-col cols="12" md="3">
          <v-textarea
            label="Group Description"
            variant="outlined"
            v-model="props.pageGroup.text"
            v-on:blur="updateGroup(false)"
            @update:modelValue="
              () => {
                groupValueChanged = true;
              }
            "
            counter="255"
          ></v-textarea>
          <v-autocomplete
            label="Group Number"
            variant="outlined"
            v-model="currentGroupSequence"
            density="compact"
            :items="groupSequences"
            @update:modelValue="updateGroupSequence"
          ></v-autocomplete>
          <v-autocomplete
            label="Display Type"
            variant="outlined"
            v-model="props.pageGroup.displayType"
            density="compact"
            :items="displayTypes"
            @update:modelValue="updateGroup(true)"
          ></v-autocomplete>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Minimum"
                variant="outlined"
                v-model="props.pageGroup.minSetCount"
                type="number"
                density="compact"
                @update:modelValue="updateMinSetCount"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Maximum"
                variant="outlined"
                v-model="props.pageGroup.maxSetCount"
                type="number"
                density="compact"
                @update:modelValue="updateMaxSetCount"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="9">
          <FieldTable
            :fields="props.pageGroup.fieldPageGroups"
            @edit-field="editField"
          />

          <v-btn
            density="comfortable"
            rounded="xl"
            color="primary"
            class="ml-1 mt-2"
            @click="addNewField"
            >+ Field</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
  </div>

  <v-dialog v-model="newFieldDialog" width="500">
    <FieldEdit
      :field="activeField"
      @save-field="saveNewField"
      @close-dialog="closeFieldDialog"
    />
  </v-dialog>
  <v-dialog v-model="confirmDelete" width="400">
    <ConfirmDelete
      :titleToDelete="props.pageGroup.title"
      @close-dialog="
        () => {
          confirmDelete = false;
        }
      "
      @confirm-delete="deleteGroup"
    />
  </v-dialog>

  <v-snackbar v-model="snackbar" :timeout="2000">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-icon
        color="accent"
        icon="mdi-close"
        variant="text"
        @click="snackbar = false"
      ></v-icon>
    </template>
  </v-snackbar>
</template>
