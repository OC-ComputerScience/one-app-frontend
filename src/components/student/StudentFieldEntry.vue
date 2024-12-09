<script setup>
import states from '../../config/states'
import AppFieldValueServices from '../../services/AppFieldValueServices'
import { VDateInput } from 'vuetify/labs/VDateInput'
import {ref, onMounted} from 'vue'

const props = defineProps(['fieldPageGroup', 'applicationId', 'setNumber'])

const appFieldValue = ref({
    applicationId: props.applicationId,
    setNumber: props.setNumber,
    fieldId: null,
    fieldValueId: null,
    fieldValueName: ''
})
const fieldValues = ref([])
const selectedFieldValue = ref(null)
const type = ref('')

const rules = {
    email: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
    ],
    phone: [
        v => !!v || 'Phone number is required',
        v => /^\+?[\d\s-]{10,}$/.test(v) || 'Phone number must be valid (minimum 10 digits)'
    ],
    text: [
        v => !!v || 'This field is required',
        v => (v && v.length <= 100) || 'Text must be less than 100 characters'
    ]
}

const changeFieldValue = (value) => {
    console.log(appFieldValue.value)
    appFieldValue.value.fieldValueId = value.id
    appFieldValue.value.fieldValueName = value.value
    console.log(appFieldValue.value)
}

const saveFieldValue = async() => {
    if(appFieldValue.value.fieldValueName === '') {
        return
    }
    if(appFieldValue.value.id) {
        await updateFieldValue()    
    }
    else {
        await saveNewFieldValue()
    }
}

const saveNewFieldValue = async() => {
    try{
        const response = await AppFieldValueServices.addAppFieldValues(appFieldValue.value)
        appFieldValue.value.id = response.data.id
    }
    catch(err){
        console.error(err)
    }
}

const updateFieldValue = async() => {
    if(appFieldValue.value.fieldValueName === props.fieldPageGroup.field.appFieldValues.fieldValueName) {
        return
    }
    try{
        await AppFieldValueServices.updateAppFieldValues(appFieldValue.value)
    }
    catch(err){
        console.error(err)
    }
}

onMounted(async() => {
    type.value = props.fieldPageGroup.field.type
    appFieldValue.value.fieldId = props.fieldPageGroup.field.id
    if(props.fieldPageGroup.field.appFieldValues.length > 0) {
        let value = props.fieldPageGroup.field.appFieldValues.find((appFieldValue) => {
            return appFieldValue.setNumber === props.setNumber
        })
        if(value) appFieldValue.value = value
    }
    if(type.value === 'Dropdown' || type.value === 'Radio') {
        fieldValues.value = props.fieldPageGroup.field.fieldValues
        if(appFieldValue.value.fieldValueId !== null) {
            selectedFieldValue.value = fieldValues.value.find((fieldValue) => {
                return fieldValue.id === appFieldValue.value.fieldValueId
            })
        }
        
    }
    else if(type.value === 'Checkbox') {
        appFieldValue.value.fieldValueName = appFieldValue.value.fieldValueName === '1' ? true : false
    }
    else if(type.value === 'State') {
        fieldValues.value = states.states
    }
    
})

</script>

<template>
<div v-if="type === 'Checkbox'" class="mt-n2">
    <v-checkbox
        v-model="appFieldValue.fieldValueName"
        :label="props.fieldPageGroup.field.name"
        @update:modelValue="saveFieldValue"
    ></v-checkbox>
</div>
<div v-else-if="type === 'Date'">
    <v-date-input 
        v-model="appFieldValue.fieldValueName"
        variant="outlined"
        density="compact"
        :label="props.fieldPageGroup.field.name"
        :placeholder="props.fieldPageGroup.field.placeholderText"
        v-on:blur="saveFieldValue"
    ></v-date-input>
</div>
<div v-else-if="type === 'Dropdown' || type === 'State'">
    <v-autocomplete
        v-model="selectedFieldValue"
        :items="fieldValues"
        :label="props.fieldPageGroup.field.name"
        :placeholder="props.fieldPageGroup.field.placeholderText"
        item-title="value"
        variant="outlined"
        density="compact"
        return-object
        @update:modelValue="changeFieldValue"
        v-on:blur="saveFieldValue"
    ></v-autocomplete>
</div>
<div v-else-if="type === 'Email' || type === 'Phone Number' || type === 'Text'">
    <v-text-field
        v-model="appFieldValue.fieldValueName" 
        :label="props.fieldPageGroup.field.name"
        :placeholder="props.fieldPageGroup.field.placeholderText"
        :rules="type === 'Email' ? rules.email : type === 'Phone Number' ? rules.phone : rules.text"
        :type="type === 'Email' ? 'email' : type === 'Phone Number' ? 'tel' : 'text'"
        variant="outlined"
        density="compact"
        v-on:blur="saveFieldValue"
    ></v-text-field>
</div>
<div v-else-if="type === 'Number'">
    <v-text-field
        v-model="appFieldValue.fieldValueName"
        :label="props.fieldPageGroup.field.name"
        :placeholder="props.fieldPageGroup.field.placeholderText"
        type="number"
        variant="outlined"
        density="compact"
        v-on:blur="saveFieldValue"
    ></v-text-field>
</div>
<div v-else-if="type === 'Paragraph'">
    <v-textarea
        v-model="appFieldValue.fieldValueName"
        :label="props.fieldPageGroup.field.name"
        :placeholder="props.fieldPageGroup.field.placeholderText"
        variant="outlined"
        density="compact"
        v-on:blur="saveFieldValue"
    ></v-textarea>    
</div>
<div v-else-if="type === 'Radio'">
    <v-radio-group
        v-model="appFieldValue.fieldValueName"
        :label="props.fieldPageGroup.field.name"
        @update:modelValue="saveFieldValue"
    >
        <v-radio
            v-for="fieldValue in fieldValues"
            :key="fieldValue.id"
            :label="fieldValue.value"
            :value="fieldValue.value"
        ></v-radio>
    </v-radio-group>
</div>
    
</template>