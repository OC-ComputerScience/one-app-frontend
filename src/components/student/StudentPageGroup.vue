<script setup>
import StudentFieldEntry from './StudentFieldEntry.vue'
import { computed, ref } from 'vue'

const props = defineProps(['pageGroup', 'applicationId'])

const canAddGroups = computed(() => {
    let isLessThanMax = props.pageGroup.numGroups < props.pageGroup.maxSetCount
    let isAtLeastMin = props.pageGroup.numGroups >= props.pageGroup.minSetCount
    return isLessThanMax && isAtLeastMin
})

const addPageGroup = () => {
    props.pageGroup.numGroups++
}

</script>

<template>
    <v-card v-for="index in props.pageGroup.numGroups" :key="index" class="mt-4">
        <v-toolbar>
            <v-toolbar-title> {{ props.pageGroup.title }} </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            {{ props.pageGroup.text }}
            <v-row>
                <v-col 
                    cols="12" md="4" sm="6" 
                    v-for="fieldPageGroup in props.pageGroup.fieldPageGroups" 
                    :key="fieldPageGroup.id"
                >
                    <StudentFieldEntry 
                        :field-page-group="fieldPageGroup"
                        :applicationId="applicationId"
                        :set-number="index"
                    />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    <v-btn 
        v-if="canAddGroups"
        icon="mdi-plus" 
        color="primary" 
        class="mt-2"
        @click="addPageGroup"
    ></v-btn>
</template>