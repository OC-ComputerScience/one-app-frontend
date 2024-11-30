<script setup>
import PageServices from '../services/PageServices'
import ApplicationServices from '../services/ApplicationServices'
import StudentPages from '../components/student/StudentPages.vue'
import StudentPageView from '../components/student/StudentPageView.vue'
import { ref, onMounted } from 'vue'

const pages = ref([])
const activePage = ref({})
const pageKey = ref(0)

const forceUpdate = () => {
    pageKey.value += 1
}

const changeActivePage = (page) => {
    activePage.value = page
    forceUpdate()
}

onMounted(async() => {
    try {
        const response = await PageServices.getPages()
        pages.value = response.data
        activePage.value = pages.value[0]
    } catch (err) {
        console.error(err)
    }
})

</script>

<template>
<div>
    <StudentPages 
        :pages="pages"
        :activePage="activePage"
        @change-active-page="changeActivePage"
    />
    <StudentPageView 
        v-if="pages.length > 0"
        :page="activePage"
        :key="pageKey"
    />
    <div v-for="pageGroup in activePage.pageGroups"  class="mb-4">
        
    </div>
</div>

</template>