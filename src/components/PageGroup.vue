<script setup>
import { ref, computed, onMounted, onUpdated } from "vue"
import PageGroupServices from "../services/PageGroupServices"
import FieldTable from "./FieldTable.vue"
import FieldEdit from "./FieldEdit.vue"
import FieldPageGroupServices from "../services/FieldPageGroupServices";

const props = defineProps(['pageGroup', 'numGroups'])
const editingTitle = ref(false)
const groupValueChanged = ref(false)
const currentGroupSequence = ref(null)
const allowMultiple = ref(false)
const newFieldDialog = ref(false)
const displayTypes = ref(['Vertical', 'Horizontal'])
const activeField = ref({
    name: '',
    label: '',
    description: '',
    type: '',
    placeholderText: '',
    isRequired: false
})

const groupSequences = computed(() => {
    let sequences = []
    for(let i = 1; i <= props.numGroups; i++) {
        sequences.push(i)
    }
    return sequences
})

const updateGroup = async() => {
    editingTitle.value = false
    if(!groupValueChanged.value){
        return
    }

    try{
        await PageGroupServices.updatePageGroups(props.pageGroup)
    }
    catch(err){
        console.error(err)
    }
}

const addNewField = () => {
    activeField.value.fieldSequence = props.pageGroup.fieldPageGroups.length
    newFieldDialog.value = true
}

const editField = (field) => {
    activeField.value = JSON.parse(JSON.stringify(field))
    newFieldDialog.value = true
}

const saveNewField = async(newField) => {
    let activeFieldPageGroup = props.pageGroup.fieldPageGroups.find((fieldPageGroup) => {
        return fieldPageGroup.fieldId === activeField.value.id
    })
    if(activeFieldPageGroup) {
        activeFieldPageGroup.field = newField
    }
    else{
        await createFieldPageGroup(newField, props.pageGroup.id)
    }
    closeFieldDialog()
}

const createFieldPageGroup = async(field, pageGroupId) => {
    let newFieldPageGroup = {
        fieldId: field.id,
        pageGroupId: pageGroupId,
        pageId: props.pageGroup.pageId,
        sequenceNumber: props.pageGroup.fieldPageGroups.length
    }
    try{
        let response = await FieldPageGroupServices.addFieldPageGroups(newFieldPageGroup)
        newFieldPageGroup = response.data
        newFieldPageGroup.field = field
        props.pageGroup.fieldPageGroups.push(newFieldPageGroup)
    }
    catch(err){
        console.error(err)
    }
}
const closeFieldDialog = () => {
    activeField.value = {
        name: '',
        label: '',
        description: '',
        type: '',
        placeholderText: '',
        fieldSequence: null,
        isRequired: false
    }
    newFieldDialog.value = false
}

onMounted(() => {
    currentGroupSequence.value = Number(props.pageGroup.groupSequence) + 1
})

onUpdated(() => {
    currentGroupSequence.value = Number(props.pageGroup.groupSequence) + 1 
})

</script>

<template>
<div>
    <v-card elevation="1" class="ml-7 mr-7" variant="elevated">
        <v-toolbar>
            <v-row v-if="!editingTitle">
                <v-col cols="12" md="6">
                    <v-toolbar-title> 
                        <v-btn
                            icon="mdi-pencil"
                            color="icons"
                            @click="() => { editingTitle = true }"
                        ></v-btn>
                        {{ props.pageGroup.title }} 
                    </v-toolbar-title>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12" md="1" align="right">
                    <v-btn
                        class="mr-2"
                        icon="mdi-trash-can-outline"
                        color="icons"
                        @click="() => { editingTitle = true }"
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
                        v-on:blur="updateGroup"
                        @update:modelValue="() => { groupValueChanged = true }"
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
                    @update:modelValue="() => { groupValueChanged = true }"
                    counter="255"
                ></v-textarea>
                <v-autocomplete
                    label="Group Number"
                    variant="outlined"
                    v-model="currentGroupSequence"
                    density="compact"
                    :items="groupSequences"
                ></v-autocomplete>
                <v-autocomplete
                    label="Display Type"
                    variant="outlined"
                    v-model="props.pageGroup.displayType"
                    density="compact"
                    :items="displayTypes"
                ></v-autocomplete>
                <v-checkbox
                    class="mt-n4"
                    label="Allow Multiple"
                    v-model="allowMultiple"
                ></v-checkbox>
                <v-row v-if="allowMultiple">
                    <v-col cols="12" md="6">
                        <v-text-field 
                            class="mt-n4"
                            label="Minimum"
                            variant="outlined"
                            v-model="props.pageGroup.minSetCount"
                            type="number"
                            density="compact"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field 
                            class="mt-n4"
                            label="Maximum"
                            variant="outlined"
                            v-model="props.pageGroup.maxSetCount"
                            type="number"
                            density="compact"
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
                    icon="mdi-plus"
                    color="primary"
                    @click="addNewField"
                    class="mt-2"
                ></v-btn>
            </v-col>
        </v-row>
    </v-card>
</div>

<v-dialog
    v-model="newFieldDialog"
    width="500"
>
    <FieldEdit
        :field="activeField"
        @save-field="saveNewField"
        @close-dialog="closeFieldDialog"
    />
</v-dialog>
</template>