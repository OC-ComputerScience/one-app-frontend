<script setup>
import { ref, computed, onMounted } from "vue";
import ApplicationServices from "../services/ApplicationServices";
import UserServices from "../services/UserServices";
import DownloadLogServices from "../services/DownloadLogServices";

const emit = defineEmits(["closeExportDialog"]);
const props = defineProps(["formData"]);

const dateField = ref(null);
const lastDownloadDate = ref(null);

const errorMessage = ref("");
const applications = ref([]);
const validForm = ref(false);
const validData = ref(false);
const json_data = ref([]);
const json_headers = ref({});
const json_fields = ref([]);

const rules = {
  required: (value) => !!value || "Required.",
};

const formatDate = (date) => {
  if (!date) return "Never";
  return new Date(date).toLocaleString();
};

const loadUserInfo = async () => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.id) {
        const response = await UserServices.getUser(user.id);
        console.log("User data:", response.data);
        console.log("Last download date:", response.data.lastDownloadDate);
        lastDownloadDate.value = response.data.lastDownloadDate;
      }
    }
  } catch (error) {
    console.error("Failed to load user info:", error);
  }
};

onMounted(() => {
  loadUserInfo();
});

const generateDownload = async () => {
  errorMessage.value = "Generating.....";

  let localDate = dateField.value.toISOString().slice(0, 10);
  await ApplicationServices.getApplicationsForFormSinceDate(
    props.formData.id,
    localDate
  )
    .then((response) => {
      applications.value = response.data;
    })
    .catch((e) => {
      errorMessage.value = e.response.data.message;
    });
  console.log(applications.value);

  // generate headers
  json_headers.value = {};
  json_fields.value = [];
  json_data.value = [];
  var dataIndex = 0;
  let headerIndex = 1;
  let field_object = {};
  applications.value[0].form.pages.sort(
    (a, b) => a.pageSequence - b.pageSequence
  );
  applications.value[0].form.pages.forEach((page) => {
    page.pageGroups.sort((a, b) => a.groupSequence - b.groupSequence);
    page.pageGroups.forEach((pageGroup) => {
      pageGroup.fieldPageGroups.sort(
        (a, b) => a.sequenceNumber - b.sequenceNumber
      );
      let setHeader = "";
      for (let i = 0; i < pageGroup.maxSetCount; i++) {
        if (pageGroup.maxSetCount > 1)
          setHeader = pageGroup.title + "-" + (i + 1);
        else setHeader = pageGroup.title;
        pageGroup.fieldPageGroups.forEach((fpg) => {
          let propValue = setHeader + "-" + fpg.field.name;
          let fieldKey = "data" + dataIndex;
          json_headers.value[fieldKey] = propValue;
          json_fields.value.push(fieldKey);
          headerIndex++;
          dataIndex++;
        });
      }
    });
  });
  console.log(json_headers.value);
  console.log(json_fields.value);

  // genarate data

  dataIndex = 0;
  var data = {};
  applications.value.forEach((application) => {
    data = {};
    dataIndex = 0;
    application.form.pages.sort((a, b) => a.pageSequence - b.pageSequence);
    application.form.pages.forEach((page) => {
      page.pageGroups.sort((a, b) => a.groupSequence - b.groupSequence);
      page.pageGroups.forEach((pageGroup) => {
        pageGroup.fieldPageGroups.sort(
          (a, b) => a.sequenceNumber - b.sequenceNumber
        );
        for (let i = 0; i < pageGroup.maxSetCount; i++) {
          pageGroup.fieldPageGroups.sort(
            (a, b) => a.sequenceNumber - b.sequenceNumber
          );
          pageGroup.fieldPageGroups.forEach((fpg) => {
            fpg.field.appFieldValues.sort((a, b) => a.setNumber - b.setNumber);
            let propValue = "";
            if (i <= fpg.field.appFieldValues.length - 1) {
              propValue = fpg.field.appFieldValues[i].fieldValueName;
              if (fpg.field.type == "Checkbox")
                propValue = propValue === "1" ? "Y" : "N";
            }

            let propName = "data" + dataIndex;
            data[propName] = propValue;
            dataIndex++;
          });
        }
      });
    });
    json_data.value.push(data);
    dataIndex++;
  });

  console.log(json_data);
  errorMessage.value =
    "Generated Data.." + applications.value.length + " records";

  validData.value = true;
};

const exported = async () => {
  validData.value = false;
  errorMessage.value =
    "Exported Data.." + applications.value.length + " records";
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.id) {
        // Use today's date for the last download date
        const today = new Date();
        await UserServices.updateLastDownloadDate(user.id, today);

        // Create download log entry
        const downloadLog = {
          fileName: `app-data-oneapp-${props.formData.name}.csv`,
          dateTime: today,
          userId: user.id,
          universityId: user.universityId,
        };
        await DownloadLogServices.addDownloadLogs(downloadLog);
      }
    }
    closeExportDialog();
  } catch (error) {
    console.error("Failed to update download information:", error);
  }
};

const closeExportDialog = () => {
  emit("closeExportDialog");
};
</script>

<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title>Download Form Data</v-card-title>
        <v-card-subtitle>Download for: {{ formData.name }}</v-card-subtitle>
        <v-card-text>
          This will export the data from applications submitted since 12:00 am
          of the Since Date. This will only export application data for
          applications that have been submitted.
        </v-card-text>
        <v-card-text>
          <div class="text-subtitle-2">
            Last Download: {{ formatDate(lastDownloadDate) }}
          </div>
        </v-card-text>
        <v-form v-model="validForm">
          <v-card-text class="mt-2 mb-n4">
            <v-date-input
              v-model="dateField"
              variant="outlined"
              density="compact"
              label="Since Date"
              :rules="[rules.required]"
            ></v-date-input>
          </v-card-text>
        </v-form>
        <v-card-text align="center" class="text-red"
          >{{ errorMessage }}
        </v-card-text>

        <v-card-actions align="right" class="mr-2 mb-2">
          <v-btn
            variant="plain"
            elevation="0"
            density="comfortable"
            @click="closeExportDialog"
            color="accent"
          >
            Cancel
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn
            variant="outlined"
            elevation="0"
            density="comfortable"
            @click="generateDownload"
            color="primary"
            :disabled="!validForm"
          >
            Generate
          </v-btn>

          <download-csv
            :data="json_data"
            name="app-data-oneapp.csv"
            :labels="json_headers"
            v-on:export-finished="exported"
          >
            <v-btn
              variant="outlined"
              elevation="0"
              density="comfortable"
              color="primary"
              :disabled="!validData"
            >
              Download
            </v-btn>
          </download-csv>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>
