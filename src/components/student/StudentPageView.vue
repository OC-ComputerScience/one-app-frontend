<script setup>
const props = defineProps(['page'])

</script>

<template>
<div>
    <v-toolbar color="#FFFFFF">
        <v-toolbar-title> {{ props.page.title }} </v-toolbar-title>
    </v-toolbar>
    <v-card-text class="mt-n4">
        {{ props.page.text }}
    </v-card-text>
</div>
</template>