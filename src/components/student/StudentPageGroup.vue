<script setup>
import StudentFieldEntry from './StudentFieldEntry.vue'

const props = defineProps(['pageGroup'])

</script>

<template>
    <v-card>
        <v-toolbar>
            <v-toolbar-title> {{ props.pageGroup.title }} </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            {{ props.pageGroup.text }}
            <v-row>
                <v-col cols="12" md="6" v-for="fieldPageGroup in props.pageGroup.fieldPageGroups" :key="fieldPageGroup.id">
                    <StudentFieldEntry 
                        :field="fieldPageGroup"
                    />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>