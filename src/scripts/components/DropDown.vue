<template>
	<div v-bind="$attrs">
		<Select
			:model-value="selectedOption"
			:options="options"
			:placeholder="placeholder"
			:disabled="disabled"
			option-label="label"
			option-disabled="disabled"
			class="drop-down w-full"
			@update:model-value="selectOption"
		/>

		<select ref="sourceSelect" class="hidden" aria-hidden="true" tabindex="-1">
			<slot />
		</select>

		<input v-if="name" type="hidden" :name="name" :value="selectedOption?.value" />
	</div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import Select from 'primevue/select'

defineOptions({ inheritAttrs: false })

const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: null
	},
	name: {
		type: String,
		default: ''
	},
	placeholder: {
		type: String,
		default: ''
	},
	disabled: {
		type: Boolean,
		default: false
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
	const value = option?.value ?? null

	emit('update:modelValue', value)
	emit('change', value)
}

watch(() => props.modelValue, syncSelectedOption)

onMounted(async () => {
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
