<script setup>
import { ref } from "vue"
import PageServices from "../services/PageServices";

const props = defineProps(['page'])

const editingTitle = ref(false)

</script>

<template>
<div>
    <v-toolbar color="#FFFFFF">
        <v-row>
            <v-col cols="12" md="2">
                <v-toolbar-title v-if="!editingTitle"> {{ props.page.title }} </v-toolbar-title>
                <v-text-field 
                    v-if="editingTitle"
                    class="mt-3"
                    v-model="props.page.title"
                    label="Page Title"
                    variant="outlined"  
                    density="compact"
                    v-on:blur="() => { editingTitle = false }"
                ></v-text-field>
            </v-col>
            <v-col class="mt-n2">
                <v-btn v-if="!editingTitle"
                    icon="mdi-pencil"
                    color="secondary"
                    @click="() => { editingTitle = true }"
                ></v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col>
                <v-btn
                    variant="outlined"
                    elevation="0"
                    density="comfortable"
                    @click="closeDialog"
                    color="accent"
                >Delete Page</v-btn>
            </v-col>
        </v-row>
    </v-toolbar>
</div>
</template>