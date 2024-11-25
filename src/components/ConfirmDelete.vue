<script setup>
const props = defineProps(['titleToDelete'])
const emits = defineEmits(['closeDialog', 'confirmDelete'])

</script>

<template>
    <v-card>
        <v-toolbar color="#FFFFFF">
            <v-toolbar-title> Delete {{ titleToDelete }} </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            Are you sure you want to delete {{ titleToDelete }}?
        </v-card-text>
        <v-card-actions align="right" class="mr-2 mb-2">
            <v-btn 
                variant="plain"
                elevation="0"
                density="comfortable"
                @click="emits('closeDialog')"
                color="secondary"
            >
                Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn 
                variant="outlined"
                elevation="0"
                density="comfortable"
                @click="emits('confirmDelete')"
                color="accent"
            >
                Delete
            </v-btn>
        </v-card-actions>
    </v-card>
</template>