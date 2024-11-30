<script setup>
import { ref, computed, onUpdated } from "vue"
import PageServices from "../../services/PageServices"
import ConfirmDelete from "../ConfirmDelete.vue"


const props = defineProps(['page', 'numPages'])
const emit = defineEmits(['updatePageSequence', 'deletePage'])

const editingTitle = ref(false)
const confirmDelete = ref(false)
const pageValueChanged = ref(false)
const currentPageSequence = ref(null)
const snackbar = ref(false)
const snackbarText = ref('')

const pageSequences = computed(() => {
    let sequences = []
    for(let i = 1; i <= props.numPages; i++) {
        sequences.push(i)
    }
    return sequences
})

const updatePage = async() => {
    editingTitle.value = false
    if(!pageValueChanged.value) {
        return
    }

    const newPageValues = {
        id: props.page.id,
        title: props.page.title,
        text: props.page.text,
        pageSequence: props.page.pageSequence
    }
    try{
        await PageServices.updatePages(newPageValues)
        snackbarText.value = 'Page Updated Successfully'
    }
    catch(err) {
        console.error(err)
        snackbarText.value = 'Failed to update page'
    }
    finally{
        snackbar.value = true
    }
}

const deletePage = async() => {
    try{
        await PageServices.deletePages(props.page.id)
        emit('deletePage', props.page)
    }
    catch(err) {
        console.error(err)
    }
    finally{
        confirmDelete.value = false
    }
}

const updatePageSequence = () => {
    emit('updatePageSequence', currentPageSequence.value - 1, props.page.pageSequence)
}

onUpdated(() => {
    currentPageSequence.value = props.page.pageSequence + 1
})

</script>

<template>
<div>
    <v-toolbar color="#FFFFFF">
            <v-row v-if="!editingTitle">
                <v-col cols="12" md="6" sm="6">
                    <v-toolbar-title class="ml-4"> 
                        <v-btn
                            icon="mdi-pencil"
                            color="icons"
                            @click="() => { editingTitle = true }"
                        ></v-btn>
                        {{ props.page.title }} 
                    </v-toolbar-title>
                </v-col>
                <v-col cols="12" md="6" sm="6" align="right">
                    <v-btn 
                        class="mt-2 mr-7"
                        variant="outlined"
                        elevation="0"
                        density="comfortable"
                        @click="() => { confirmDelete = true }"
                        color="accent"
                    >Delete Page</v-btn>
                </v-col>
            </v-row>
            <v-row v-if="editingTitle">
                <v-col cols="12" md="4">
                    <v-text-field 
                        class="ml-4 mt-6"
                        v-model="props.page.title"
                        variant="outlined"
                        label="Group Title"
                        density="compact"
                        v-on:blur="updatePage"
                        @update:modelValue="() => { pageValueChanged = true }"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-toolbar>

    <div class="mt-4">
        <v-row class="ml-4 mr-4">
            <v-col cols="12" md="2">
                <v-autocomplete
                    label="Page Number"
                    v-model="currentPageSequence"
                    variant="outlined"
                    :items="pageSequences"
                    density="compact"
                    @update:modelValue="updatePageSequence"
                ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="10">
                <v-textarea
                    label="Page Description"
                    variant="outlined"
                    v-model="props.page.text"
                    counter="1000"
                    v-on:blur="updatePage"
                    @update:modelValue="() => { pageValueChanged = true }"
                ></v-textarea>
            </v-col>
        </v-row>
    </div>
</div>
<v-dialog v-model="confirmDelete" width="400">
    <ConfirmDelete 
        :titleToDelete="props.page.title"
        @close-dialog="() => { confirmDelete = false }"
        @confirm-delete="deletePage"
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