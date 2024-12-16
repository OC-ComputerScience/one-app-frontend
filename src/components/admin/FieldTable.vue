<script setup>
import { ref, onMounted, onUpdated } from 'vue';
import FieldPageGroupServices from '../../services/FieldPageGroupServices'
import FieldServices from '../../services/FieldServices'
import ConfirmDelete from '../ConfirmDelete.vue'

const props = defineProps(["fields"])
const emit = defineEmits(["editField"])
const snackbar = ref(false)
const snackbarText = ref('')

const headers = [
  { text: 'Field Name', value: 'name' },
  { text: 'Field Type', value: 'type' },
  { text: 'Actions', value: 'actions', sortable: false },
];

const items = ref([]);
const selectedItem = ref(null);
const confirmDelete = ref(false)

onMounted(() => {
  items.value = props.fields;
  if(items.value){
    items.value.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  }}
)

onUpdated(() => {
  items.value = props.fields;
  if(items.value){
    items.value.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  }
})

let timer

const moveItemUp = async(item) => {
  clearTimeout(timer);
  const index = items.value.indexOf(item);
  if (index > 0) {
    items.value.splice(index, 1);
    items.value.splice(index - 1, 0, item);
    updateFieldOrder()
  }
  timer = setTimeout(() => updateAllFields(), 2000)
};

const moveItemDown = async(item) => {
  clearTimeout(timer);
  const index = items.value.indexOf(item);
  if (index < items.value.length - 1) {
    items.value.splice(index, 1);
    items.value.splice(index + 1, 0, item);
    updateFieldOrder()
  }
  timer = setTimeout(() => updateAllFields(), 2000)
}

const updateFieldOrder = () => {
  items.value.forEach((item, index) => {
    item.sequenceNumber = index
  })
}

const openDeleteDialog = (item) => {
  selectedItem.value = item
  confirmDelete.value = true
}

const deleteField = async() => {
  items.value.splice(items.value.indexOf(selectedItem.value), 1)
  try{
    await FieldServices.deleteFields(selectedItem.value.fieldId)
    await FieldPageGroupServices.deleteFieldPageGroups(selectedItem.value.id)
    updateFieldOrder()
    await updateAllFields()
  }
  catch(err){
    console.error(err)
  }
  finally{
    confirmDelete.value = false
  }
}

const updateAllFields = async() => {
  try{
    await Promise.all(items.value.map((item) =>{
      const fieldPageGroup = {
        id: item.id,
        fieldId: item.fieldId,
        pageId: item.pageId,
        sequenceNumber: item.sequenceNumber,
        pageGroupId: item.pageGroupId
      }
      return FieldPageGroupServices.updateFieldPageGroups(fieldPageGroup)
    }))
    snackbarText.value = 'Fields Updated Successfully'
  }
  catch(err){
    console.error(err)
    snackbarText.value = 'Failed to update fields'
  }
  finally{
    snackbar.value = true
  }
}
</script>

<template>
  <v-card elevation="0">
    <v-table density="compact">
      <thead>
        <tr>
          <th  class="text-left">
            {{ headers[0].text }}
          </th>
          <th  class="text-left">
            {{ headers[1].text }}
          </th>
          <th  class="text-right">
            {{ headers[2].text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.name">
          <td>{{ item.field.name }}</td>
          <td>{{ item.field.type }}</td>
          <td align="right">
            <v-icon 
              icon="mdi-pencil" 
              class="mr-2"
              @click="emit('editField', item.field)"  
            ></v-icon>
            <v-icon 
              icon="mdi-delete" 
              class="mr-2"
              @click="openDeleteDialog(item)"  
            ></v-icon>
            <v-icon 
              v-if="items.indexOf(item) > 0"
              icon="mdi-arrow-up"
              @click="moveItemUp(item)" 
              class="mr-2"
            ></v-icon>
            <v-icon 
              v-if="items.indexOf(item) < items.length - 1" 
              icon="mdi-arrow-down" 
              @click="moveItemDown(item)"
            ></v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
  <v-dialog v-model="confirmDelete" width="400">
    <ConfirmDelete 
      :titleToDelete="selectedItem.field.name"
      @close-dialog="() => { confirmDelete = false }"
      @confirm-delete="deleteField"
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

<style scoped>
/* Add any specific styles for the FieldTable component here */
</style>