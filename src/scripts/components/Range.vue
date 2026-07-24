<template>
	<div :data-min="internalValue[0]" :data-max="internalValue[1]" class="flex flex-col gap-4">
		<div v-if="textLabel" class="text-primary text-sm leading-snug font-medium" v-html="textLabel" />

		<div class="grid grid-cols-2 gap-2">
			<FloatLabel variant="in">
				<InputText
					:id="`${rangeId}-from`"
					:model-value="formatValue(internalValue[0])"
					readonly
					autocomplete="off"
					class="w-full overflow-hidden text-ellipsis"
				/>
				<label :for="`${rangeId}-from`" v-html="textFrom" />

				<input type="hidden" data-id="from" :value="internalValue[0]" ref="fromInput" />
			</FloatLabel>

			<FloatLabel variant="in">
				<InputText
					:id="`${rangeId}-to`"
					:model-value="formatValue(internalValue[1])"
					readonly
					autocomplete="off"
					class="w-full overflow-hidden text-ellipsis"
				/>
				<label :for="`${rangeId}-to`" v-html="textTo" />

				<input type="hidden" data-id="to" :value="internalValue[1]" ref="toInput" />
			</FloatLabel>
		</div>
		<div class="px-3">
			<Slider class="w-full" v-model="internalValue" :min="min" :max="max" :step="sliderStep" range />
		</div>
		<div v-if="filter" class="d-flex align-items-center justify-content-between mt-1-half">
			<span class="text-dark fw-semibold"> {{ formatPrice(internalValue[0]) }} - {{ formatPrice(internalValue[1]) }}</span>

			<button class="btn btn-primary">{{ filter }}</button>
		</div>
	</div>
</template>

<script setup>
import { computed, nextTick, ref, useId, watch } from 'vue'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Slider from 'primevue/slider'

const props = defineProps({
	min: {
		type: Number,
		default: 0
	},
	max: {
		type: Number,
		default: 100
	},
	currentMax: {
		type: [Number, Boolean],
		default: false
	},
	currentMin: {
		type: [Number, Boolean],
		default: false
	},
	currency: {
		type: String,
		default: '€'
	},
	textLabel: {
		type: String
	},
	textTo: {
		type: String
	},
	textFrom: {
		type: String
	},
	formatType: {
		type: String,
		default: 'default',
		validator: (value) => ['default', 'display', 'contrast'].includes(value)
	},
	step: {
		type: Number,
		default: null
	},
	filter: {
		type: String
	}
})

const internalValue = ref([props.currentMin ? props.currentMin : props.min, props.currentMax ? props.currentMax : props.max])
const rangeId = useId()
const sliderStep = computed(() => props.step ?? (props.formatType === 'display' ? 0.01 : 1))

function formatValue(value) {
	if (props.formatType === 'display') {
		const centimeters = Number(value).toLocaleString('sk-SK', { maximumFractionDigits: 2 })
		const inches = (Number(value) / 2.54).toLocaleString('sk-SK', {
			minimumFractionDigits: 1,
			maximumFractionDigits: 1
		})

		return `${centimeters} cm (${inches}")`
	}

	if (props.formatType === 'contrast') {
		const contrast = Math.round(Number(value))
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

		return `${contrast}:1`
	}

	return value
}

function formatPrice(value) {
	return `${value.toLocaleString('sk-SK')} ${props.currency}`
}

const fromInput = ref(null)
const toInput = ref(null)

// Флаг для отслеживания изменения
let isUpdatingFromInput = false
let isUpdatingToInput = false

watch(
	internalValue,
	async (newVal) => {
		await nextTick()

		if (!isUpdatingFromInput) {
			isUpdatingFromInput = true
			fromInput.value.dispatchEvent(new Event('change'))
			isUpdatingFromInput = false
		}

		if (!isUpdatingToInput) {
			isUpdatingToInput = true
			toInput.value.dispatchEvent(new Event('change'))
			isUpdatingToInput = false
		}
	},
	{ deep: true }
)
</script>
