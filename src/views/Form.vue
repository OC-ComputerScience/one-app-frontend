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

const updatePageSequence = async(newIndex, oldIndex) => {
    pages.value.splice(newIndex, 0, pages.value.splice(oldIndex, 1)[0]);
    pages.value.forEach((page, i) => {
        page.pageSequence = i;
    });
    try {
        await Promise.all(pages.value.map(page => PageServices.updatePages(page)));
    } catch (err) {
        console.error(err);
    }
};

onMounted(async() => {
    try{
        const response = await PageServices.getPages()
        pages.value = response.data
        pages.value.sort((a, b) => { return a.pageSequence - b.pageSequence })
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
    <Pages 
        v-if="dataLoaded"
        :pages="pages" 
        :activePage="activePage"
        @change-active-page="changeActivePage"    
    />
    <PageView 
        :page="activePage"
        :num-pages="pages.length"
        @update-page-sequence="updatePageSequence"
    />
</div>

</template>