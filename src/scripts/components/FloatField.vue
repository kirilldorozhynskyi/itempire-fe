<template>
	<FloatLabel v-bind="$attrs" variant="in" class="float-field w-full">
		<Select
			v-if="fieldType === 'select'"
			:id="id"
			:model-value="selectedOption"
			:options="options"
			:placeholder="placeholder"
			option-label="label"
			option-disabled="disabled"
			overlay-class="float-field-select-panel"
			class="w-full"
			@update:model-value="selectOption"
		/>

		<InputText
			v-else-if="fieldType !== 'textarea'"
			:id="id"
			:name="name"
			:type="fieldType"
			:placeholder="placeholder"
			:autocomplete="autocomplete"
			class="w-full"
		/>

		<Textarea v-else :id="id" :name="name" :placeholder="placeholder" class="h-26 max-h-26 w-full resize-none" />

		<label :for="id">{{ label }}</label>
	</FloatLabel>

	<template v-if="fieldType === 'select'">
		<select ref="sourceSelect" class="hidden" aria-hidden="true" tabindex="-1">
			<slot />
		</select>
		<input v-if="name" type="hidden" :name="name" :value="selectedOption?.value" />
	</template>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'

defineOptions({ inheritAttrs: false })

const props = defineProps({
	id: {
		type: String,
		required: true
	},
	label: {
		type: String,
		required: true
	},
	name: {
		type: String,
		default: ''
	},
	fieldType: {
		type: String,
		default: 'text'
	},
	placeholder: {
		type: String,
		default: ''
	},
	autocomplete: {
		type: String,
		default: ''
	},
	modelValue: {
		type: [String, Number],
		default: null
	}
})

const sourceSelect = ref(null)
const options = ref([])
const selectedOption = ref(null)

const syncSelectedOption = (value) => {
	selectedOption.value = options.value.find((option) => option.value === value) ?? options.value[0] ?? null
}

const selectOption = (option) => {
	selectedOption.value = option
}

watch(() => props.modelValue, syncSelectedOption)

onMounted(async () => {
	if (props.fieldType !== 'select') return

	await nextTick()
	options.value = Array.from(sourceSelect.value?.options ?? [], (option, index) => ({
		id: index,
		label: option.text.trim(),
		value: option.hasAttribute('value') ? option.value : option.text.trim(),
		disabled: option.disabled
	}))
	syncSelectedOption(props.modelValue)
})
</script>
