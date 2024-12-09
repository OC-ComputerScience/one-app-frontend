<script setup>
import PageServices from '../services/PageServices'
import ApplicationServices from '../services/ApplicationServices'
import StudentPages from '../components/student/StudentPages.vue'
import StudentPageView from '../components/student/StudentPageView.vue'
import StudentPageGroup from '../components/student/StudentPageGroup.vue'
import store from '../store/store'
import { ref, onMounted } from 'vue'

const pages = ref([])
const activePage = ref({})
const pageKey = ref(0)
const user = ref(null)
const application = ref(null)

const forceUpdate = () => {
    pageKey.value += 1
}

const changeActivePage = (page) => {
    activePage.value = page
    forceUpdate()
}

const retrieveApplications = async() => {
    try {
        const response = await ApplicationServices.getApplicationsByUserId(user.value.id)
        application.value = response.data[0]
        if(!application.value) {
            await createApplication()
        }
    } catch (err) {
        console.error(err)
    }
}

const createApplication = async() => {
    try {
        const application = {
            status: 'pending',
            userId: user.value.id
        }
        const response = await ApplicationServices.addApplications(application)
        application.value = response.data
    } catch (err) {
        console.error(err)
    }
}

const retrievePages = async() => {
    try {
        const response = await PageServices.getPagesByUserId(user.value.id)
        pages.value = response.data
        pages.value.sort((a, b) => { return a.pageSequence - b.pageSequence })
        pages.value.forEach(page => {
            page.pageGroups.sort((a, b) => { return a.groupSequence - b.groupSequence })
        })
        activePage.value = pages.value[0]
    } catch (err) {
        console.error(err)
    }
}

onMounted(async() => {
    user.value = store.getters.getUser
    await retrieveApplications()
    await retrievePages()
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
    <div v-for="pageGroup in activePage.pageGroups"  class="mb-4 mr-4 ml-4">
        <StudentPageGroup 
            :applicationId="application.id"
            :page-group="pageGroup"
        />
    </div>
</div>

</template>