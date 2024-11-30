<script setup>
import states from '../../config/states'
import FieldValueServices from '../../services/FieldValueServices'
import {ref, onMounted} from 'vue'

const props = defineProps(['field'])
const model = defineModel()
const fieldValues = ref([])
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

const retrieveFieldValues = async() => {
    try{
        const response = await FieldValueServices.getValuesForField(props.field.field.id)
        fieldValues.value = response.data
    }
    catch(err){
        console.error(err)
    }
}

onMounted(async() => {
    type.value = props.field.field.type
    if(type.value === 'Dropdown' || type.value === 'Radio') {
        await retrieveFieldValues()
    }
    else if(type.value === 'State') {
        fieldValues.value = states.states
    }
})

</script>

<template>
<div v-if="type === 'Checkbox'">
    <v-checkbox
        v-model="model"
        :label="props.field.field.name"
    ></v-checkbox>
</div>
<div v-else-if="type === 'Date'">
    <v-date-input 
        v-model="model"
    ></v-date-input>
</div>
<div v-else-if="type === 'Dropdown' || type === 'State'">
    <v-autocomplete
        v-model="model"
        :items="fieldValues"
        :label="props.field.field.name"
        :placeholder="props.field.field.placeholderText"
        variant="outlined"
        density="compact"
    ></v-autocomplete>
</div>
<div v-else-if="type === 'Email' || type === 'Phone Number' || type === 'Text'">
    <v-text-field
        v-model="model"
        :label="props.field.field.name"
        :placeholder="props.field.field.placeholderText"
        :rules="type === 'Email' ? rules.email : type === 'Phone Number' ? rules.phone : rules.text"
        :type="type === 'Email' ? 'email' : type === 'Phone Number' ? 'tel' : 'text'"
        variant="outlined"
        density="compact"
    ></v-text-field>
</div>
<div v-else-if="type === 'Number'">
    <v-text-field
        v-model="model"
        :label="props.field.field.name"
        :placeholder="props.field.field.placeholderText"
        type="number"
        variant="outlined"
        density="compact"
    ></v-text-field>
</div>
<div v-else-if="type === 'Paragraph'">
    <v-textarea
        v-model="model"
        :label="props.field.field.name"
        :placeholder="props.field.field.placeholderText"
        variant="outlined"
    ></v-textarea>    
</div>
<div v-else-if="type === 'Radio'">
    <v-radio-group
        v-model="model"
        :label="props.field.field.name"
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