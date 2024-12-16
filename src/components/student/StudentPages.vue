<script setup>
import { ref, onMounted, onUpdated } from "vue"

const props = defineProps(['pages', 'activePage'])
const emit = defineEmits(['changeActivePage'])

const activePage = ref({})

const changeActivePage = () => {
    emit('changeActivePage', activePage.value)
}

onMounted(() => {
    activePage.value = props.activePage
})

onUpdated(() => {
    activePage.value = props.activePage
})

</script>

<template>
<div>
    <v-navigation-drawer permanent>
        <v-tabs
            v-model="activePage"
            color="primary"
            direction="vertical"
            @update:modelValue="changeActivePage"
        >
            <v-tab 
                v-for="page in props.pages"
                :key="page.id"
                :text="page.title"
                :value="page"
            ></v-tab>
        </v-tabs>
    </v-navigation-drawer>
</div>
</template>