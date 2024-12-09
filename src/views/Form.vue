<script setup>
import { ref, onMounted } from "vue"
import PageServices from "../services/PageServices"
import Pages from "../components/admin/AdminPages.vue"
import PageView from "../components/admin/PageView.vue"
import PageGroup from "../components/admin/PageGroup.vue"
import PageGroupServices from "../services/PageGroupServices"
import PageGroupAdd from "../components/admin/PageGroupAdd.vue"

const pages = ref([])
const activePage = ref({})
const dataLoaded = ref(false)
const newGroupDialog = ref(false)
const pageKey = ref(0)
const snackbar = ref(false)
const snackbarText = ref('')

const forceUpdate = () => {
    pageKey.value += 1
}

const changeActivePage = (newActivePage) => {
    activePage.value = newActivePage
    forceUpdate()
}

const deletePage = async(page) => {
    let index = pages.value.indexOf(page)
    pages.value.splice(index, 1)
    activePage.value = pages.value[index - 1]
    pages.value.forEach((page, i) => {
        page.pageSequence = i
    })
    try {
        await Promise.all(pages.value.map(page => PageServices.updatePages(page)))
        snackbarText.value = 'Page Deleted Successfully'
    } catch (err) {
        console.error(err)
        snackbarText.value = 'Failed to delete page'
    }
    finally{
        forceUpdate()
        snackbar.value = true
    }
}

const updatePageSequence = async(newIndex, oldIndex) => {
    pages.value.splice(newIndex, 0, pages.value.splice(oldIndex, 1)[0])
    pages.value.forEach((page, i) => {
        page.pageSequence = i
    })
    try {
        await Promise.all(pages.value.map(page => PageServices.updatePages(page)))
        snackbarText.value = 'Page Sequence Updated Successfully'
    } catch (err) {
        console.error(err)
        snackbarText.value = 'Failed to update page sequence'
    }
    finally{
        forceUpdate()
        snackbar.value = true
    }
}

const deleteGroup = async(pageGroup) => {
    let index = activePage.value.pageGroups.indexOf(pageGroup)
    activePage.value.pageGroups.splice(index, 1)
    activePage.value.pageGroups.forEach((pageGroup, i) => {
        pageGroup.groupSequence = i
    })
    try {
        await Promise.all(activePage.value.pageGroups.map(pageGroup => PageGroupServices.updatePageGroups(pageGroup)))
        snackbarText.value = 'Group Deleted Successfully'
    } catch (err) {
        console.error(err)
        snackbarText.value = 'Failed to delete group'
    }
    finally{
        snackbar.value = true
    }
}

const updateGroupSequence = async(newIndex, oldIndex) => {
    activePage.value.pageGroups.splice(newIndex, 0, activePage.value.pageGroups.splice(oldIndex, 1)[0])
    activePage.value.pageGroups.forEach((pageGroup, i) => {
        pageGroup.groupSequence = i
    })
    try {
        await Promise.all(activePage.value.pageGroups.map(pageGroup => PageGroupServices.updatePageGroups(pageGroup)))
        snackbarText.value = 'Group Updated Successfully'
    } catch (err) {
        console.error(err)
        snackbarText.value = 'Failed to update group'
    }
    finally{
        snackbar.value = true
    }
}

const retrievePages = async() => {
    try{
        const response = await PageServices.getPages()
        pages.value = response.data
        pages.value.sort((a, b) => { return a.pageSequence - b.pageSequence })
        activePage.value = pages.value[0]
        sortGroups()
    }
    catch(err) {
        console.error(err)
        snackbarText.value = 'Failed to retrieve pages'
        snackbar.value = true
    }
    finally{
        dataLoaded.value = true
    }
}

const sortGroups = () => {
    pages.value.forEach(page => {
        page.pageGroups.sort((a, b) => { return a.groupSequence - b.groupSequence })
    })
}

const openNewGroupDialog = () => {
    newGroupDialog.value = true
}

const closeNewGroupDialog = () => {
    newGroupDialog.value = false
}


const saveNewGroup = async (group) => {
    try {
        const response = await PageGroupServices.addPageGroups(group)
        response.data.fieldPageGroups = []
        activePage.value.pageGroups.push(response.data)
        sortGroups()
        closeNewGroupDialog()
        snackbarText.value = 'Group Added Successfully'
    } catch (err) {
        console.error(err)
        snackbarText.value = 'Failed to add group'
    } finally {
        snackbar.value = true
    }
}

onMounted(async() => {
    await retrievePages()
})
</script>

<template>
<div>
    <Pages 
        :pages="pages" 
        :activePage="activePage"
        @change-active-page="changeActivePage"    
    />
    <PageView 
        v-if="pages.length > 0"
        :page="activePage"
        :num-pages="pages.length"
        :key="pageKey"
        @update-page-sequence="updatePageSequence"
        @delete-page="deletePage"
    />
    <div v-for="pageGroup in activePage.pageGroups"  class="mb-4">
        <PageGroup 
            :page-group="pageGroup"
            :num-groups="activePage.pageGroups.length"
            @update-group-sequence="updateGroupSequence"
            @delete-group="deleteGroup"
        />
    </div>
    <v-btn
    class="ml-6"
        color="primary"
        icon="mdi-plus"
        density="comfortable"
        @click="openNewGroupDialog"
    >
    </v-btn>

    <v-dialog
        v-model="newGroupDialog"
        persistent
        width="500"
    >
        <PageGroupAdd
            :page-id="activePage.id"
            :num-groups="activePage.pageGroups.length"
            @save-group="saveNewGroup"
            @close-dialog="closeNewGroupDialog"
        />
    </v-dialog>
</div>
</template>