<template>
	<fieldset class="flex flex-col gap-3">
		<legend class="sr-only">{{ label }}</legend>
		<input type="hidden" :name="name" :value="selectedRating" />

		<div class="flex gap-1" @mouseleave="hoverRating = 0">
			<button
				v-for="rating in max"
				:key="rating"
				type="button"
				class="flex cursor-pointer text-5xl transition-colors"
				:class="rating <= displayedRating ? 'text-purple' : 'text-neutral-300'"
				:aria-label="`${rating} z ${max} hviezdičiek`"
				:aria-pressed="selectedRating === rating"
				@mouseenter="hoverRating = rating"
				@focus="hoverRating = rating"
				@blur="hoverRating = 0"
				@click="selectRating(rating)"
			>
				<SvgIcon name="star" />
			</button>
		</div>
	</fieldset>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SvgIcon from './SvgIcon.vue'

const props = withDefaults(
	defineProps<{
		modelValue?: number
		name?: string
		label?: string
		max?: number
	}>(),
	{
		modelValue: 0,
		name: 'rating',
		label: 'Hodnotenie produktu',
		max: 5
	}
)

const emit = defineEmits<{
	'update:modelValue': [value: number]
	change: [value: number]
}>()

const selectedRating = ref(props.modelValue)
const hoverRating = ref(0)
const displayedRating = computed(() => hoverRating.value || selectedRating.value)

watch(
	() => props.modelValue,
	(value) => {
		selectedRating.value = value
	}
)

const selectRating = (rating: number) => {
	selectedRating.value = rating
	emit('update:modelValue', rating)
	emit('change', rating)
}
</script>
