<template>
	<div :data-min="internalValue[0]" :data-max="internalValue[1]" class="flex w-full flex-col gap-4">
		<div v-if="textLabel" class="text-primary text-sm leading-snug font-medium" v-html="textLabel" />

		<div class="grid grid-cols-2 gap-2">
			<div class="flex h-[45px] min-w-0 items-center rounded-sm border border-neutral-300 bg-white p-2">
				<div class="flex min-w-0 flex-col items-start justify-center whitespace-nowrap">
					<span class="text-subtile -mb-1 shrink-0 text-sm leading-snug font-medium" v-html="textFrom" />
					<output
						class="text-primary block max-w-full shrink-0 overflow-hidden text-center text-base leading-6 tracking-tight text-ellipsis"
						v-text="formatValue(internalValue[0])"
					/>
				</div>
				<input type="hidden" data-id="from" :value="internalValue[0]" ref="fromInput" />
			</div>

			<div class="flex h-[45px] min-w-0 items-center rounded-sm border border-neutral-300 bg-white p-2">
				<div class="flex min-w-0 flex-col items-start justify-center whitespace-nowrap">
					<span class="text-subtile -mb-1 shrink-0 text-sm leading-snug font-medium" v-html="textTo" />
					<output
						class="text-primary block max-w-full shrink-0 overflow-hidden text-center text-base leading-6 tracking-tight text-ellipsis"
						v-text="formatValue(internalValue[1])"
					/>
				</div>
				<input type="hidden" data-id="to" :value="internalValue[1]" ref="toInput" />
			</div>
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
import { computed, nextTick, ref, watch } from 'vue'
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

	return formatPrice(value)
}

function formatPrice(value) {
	return `${Number(value).toLocaleString('sk-SK')}\u00a0${props.currency}`
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
