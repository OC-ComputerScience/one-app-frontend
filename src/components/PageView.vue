<script setup>
import { ref, computed, onUpdated } from "vue"
import PageServices from "../services/PageServices";

const props = defineProps(['page', 'numPages'])
const emit = defineEmits(['updatePageSequence'])

const editingTitle = ref(false)
const confirmDelete = ref(false)
const pageValueChanged = ref(false)
const currentPageSequence = ref(null)

const pageSequences = computed(() => {
    let sequences = []
    for(let i = 1; i <= props.numPages; i++) {
        sequences.push(i)
    }
    return sequences
})

const updatePage = async() => {
    if(!pageValueChanged.value) {
        return
    }
    if(editingTitle.value){
        editingTitle.value = false
    }

    const newPageValues = {
        id: props.page.id,
        title: props.page.title,
        text: props.page.text,
        pageSequence: props.page.pageSequence
    }
    try{
        await PageServices.updatePages(newPageValues)
    }
    catch(err) {
        console.error(err)
    }
}

const updatePageSequence = () => {
    emit('updatePageSequence', currentPageSequence.value - 1, props.page.pageSequence)
}

onUpdated(() => {
    currentPageSequence.value = props.page.pageSequence + 1
})
// TODO - Confirm delete dialog

</script>

<template>
<div>
    <v-toolbar color="#FFFFFF">
        <v-row style="margin-left: 2px">
            <v-col class="mt-n5" cols="12" md="3" v-if="!editingTitle">
                <v-row>
                    <v-col cols="12" md="2">
                        <v-btn
                            icon="mdi-pencil"
                            color="secondary"
                            @click="() => { editingTitle = true }"
                        ></v-btn>
                    </v-col>
                    <v-col cols="12" md="10" class="mt-3 ml-n4">
                        <v-toolbar-title > {{ props.page.title }} </v-toolbar-title>
                    </v-col>
                </v-row>
            </v-col>
            <v-col v-if="editingTitle" cols="12" md="4">
                <v-text-field 
                    class="mt-4 ml-2"
                    v-model="props.page.title"
                    label="Page Title"
                    variant="outlined"  
                    density="compact"
                    v-on:blur="() => { editingTitle = false }"
                    @update:modelValue="() => { pageValueChanged = true }"
                ></v-text-field>
            </v-col>
            
            <v-spacer></v-spacer>

            <v-col cols="12" md="2" v-if="!editingTitle">
                <v-btn 
                    variant="outlined"
                    elevation="0"
                    density="comfortable"
                    @click="() => { confirmDelete = true }"
                    color="accent"
                >Delete Page</v-btn>
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
</template>