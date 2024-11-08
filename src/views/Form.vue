<script setup>
import { ref, onMounted } from "vue"
import PageServices from "../services/PageServices"
import Pages from "../components/Pages.vue"
import PageView from "../components/PageView.vue"

const pages = ref([])
const activePage = ref({})
const dataLoaded = ref(false)

const changeActivePage = (newActivePage) => {
    activePage.value = newActivePage
}

onMounted(async() => {
    try{
        const response = await PageServices.getPages()
        pages.value = response.data
        activePage.value = pages.value[0]
        dataLoaded.value = true
    }
    catch(err) {
        console.error(err)
    }
    
})
</script>

<template>
<div>
    <v-row>
    <v-col cols="12">
        <v-toolbar color="#FFFFFF">
        <v-toolbar-title> Edit Form </v-toolbar-title>
        <v-spacer></v-spacer>
        </v-toolbar>
        <v-divider style="height: 3px"></v-divider>
    </v-col>
    </v-row>
    <v-row class="mt-n6">
    <v-col cols="12" md="2">
        <Pages 
            v-if="dataLoaded"
            :pages="pages" 
            :activePage="activePage"
            @change-active-page="changeActivePage"    
        />
    </v-col>
    <v-col cols="12" md="10">
        <PageView 
            :page="activePage"
        />
    </v-col>
    </v-row>
</div>

</template>