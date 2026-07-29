<template>
	<FloatLabel v-bind="$attrs" variant="in" class="float-field w-full">
		<Select
			v-if="fieldType === 'select'"
			:input-id="id"
			:model-value="selectedOption"
			:options="options"
			:placeholder="placeholder"
			:required="required"
			:aria-label="label"
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
			:model-value="modelValue"
			:placeholder="placeholder"
			:autocomplete="autocomplete"
			:required="required"
			class="w-full"
			@update:model-value="updateValue"
		/>

		<Textarea
			v-else
			:id="id"
			:name="name"
			:model-value="modelValue"
			:placeholder="placeholder"
			:required="required"
			class="h-26 max-h-26 w-full resize-none"
			@update:model-value="updateValue"
		/>

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
	required: {
		type: Boolean,
		default: false
	},
	modelValue: {
		type: [String, Number],
		default: null
	}
})

const emit = defineEmits(['update:modelValue', 'change'])

const sourceSelect = ref(null)
const options = ref([])
const selectedOption = ref(null)

const syncSelectedOption = (value) => {
	selectedOption.value = options.value.find((option) => option.value === value) ?? options.value[0] ?? null
}

const selectOption = (option) => {
	selectedOption.value = option
	updateValue(option?.value ?? null)
}

const updateValue = (value) => {
	emit('update:modelValue', value)
	emit('change', value)
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
