<script setup>
import { ref } from "vue"

const props = defineProps(['pageId', 'numGroups'])
const emits = defineEmits(['closeDialog', 'saveGroup'])

const form = ref(null)
const displayTypes = ref(['Vertical', 'Horizontal'])
const newGroup = ref({
    title: '',
    text: '',
    displayType: 'Vertical',
    minSetCount: 1,
    maxSetCount: 1,
    pageId: props.pageId,
    groupSequence: 0
})

const saveGroup = async () => {
    try {
        newGroup.value.groupSequence = props.numGroups
        newGroup.value.fieldPageGroups = []
        emits('saveGroup', newGroup.value)
        closeDialog()
    } catch (err) {
        console.error(err)
    }
}

const closeDialog = () => {
    newGroup.value = {
        title: '',
        text: '',
        displayType: 'Vertical',
        minSetCount: 1,
        maxSetCount: 1,
        pageId: props.pageId,
        groupSequence: 0
    }
    emits('closeDialog')
}
</script>

<template>
    <v-card>
        <v-toolbar color="#FFFFFF">
            <v-toolbar-title> Add Group </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <v-form v-model="form">
                <v-text-field
                    v-model="newGroup.title"
                    label="Group Title*"
                    required
                    variant="outlined"
                    density="compact"
                ></v-text-field>
                <v-textarea
                    v-model="newGroup.text"
                    label="Description"
                    variant="outlined"
                    density="compact"
                ></v-textarea>
                <v-autocomplete
                    v-model="newGroup.displayType"
                    :items="displayTypes"
                    label="Display Type*"
                    required
                    variant="outlined"
                    density="compact"
                ></v-autocomplete>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="newGroup.minSetCount"
                            label="Minimum*"
                            type="number"
                            variant="outlined"
                            density="compact"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="newGroup.maxSetCount"
                            label="Maximum*"
                            type="number"
                            variant="outlined"
                            density="compact"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions align="right" class="mr-4 ml-2 mb-2 mt-n6">
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
                @click="saveGroup"
                color="primary"
            >
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
