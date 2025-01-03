<script setup>
const props = defineProps(["page"]);
</script>

<template>
  <div>
    <v-toolbar color="#FFFFFF">
      <v-toolbar-title> {{ props.page.title }} </v-toolbar-title>
    </v-toolbar>

    <v-card-text class="mt-n4">
      {{ props.page.text }}
    </v-card-text>
    <v-card-text class="font-italic mt-n4">
      Note: When entering data, exit each field with tab or by clicking outside
      the field to auto save the entered data. Required fields are indicated
      with an * after the field name.
    </v-card-text>
  </div>
</template>
