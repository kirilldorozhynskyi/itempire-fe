<template>
	<div class="flex h-12 items-center rounded-sm border border-neutral-300 bg-transparent">
		<button
			type="button"
			class="transit hover:text-purple focus-visible:outline-purple flex size-12 cursor-pointer items-center justify-center hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-current"
			:disabled="value <= min"
			aria-label="Decrease quantity"
			@click="setValue(value - 1)"
		>
			<SvgIcon name="minus" class="text-xl!" />
		</button>

		<input
			type="number"
			class="h-full w-10 appearance-none bg-transparent text-center font-medium outline-none"
			:min="min"
			:max="max"
			:value="value"
			aria-label="Quantity"
			@change="setValue($event.target.value)"
		/>

		<button
			type="button"
			class="transit hover:text-purple focus-visible:outline-purple flex size-12 cursor-pointer items-center justify-center hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-current"
			:disabled="value >= max"
			aria-label="Increase quantity"
			@click="setValue(value + 1)"
		>
			<SvgIcon name="plus" class="text-xl!" />
		</button>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import SvgIcon from './SvgIcon.vue'

const props = defineProps({
	modelValue: {
		type: Number,
		default: 1
	},
	min: {
		type: Number,
		default: 1
	},
	max: {
		type: Number,
		default: 99
	}
})

const emit = defineEmits(['update:modelValue', 'change'])
const value = ref(Math.min(Math.max(props.modelValue, props.min), props.max))

const setValue = (nextValue) => {
	value.value = Math.min(Math.max(Number(nextValue) || props.min, props.min), props.max)
	emit('update:modelValue', value.value)
	emit('change', value.value)
}
</script>
