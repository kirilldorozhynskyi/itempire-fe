<template>
	<slot name="trigger" :open="open" :active-filter-count="activeFilterCount"></slot>

	<Drawer v-model:visible="visible" position="right" class="filter-drawer !w-full md:!w-120">
		<template #header>
			<div class="flex min-w-0 flex-1 items-center justify-between gap-4">
				<h2 class="font-serif text-xl leading-tight font-semibold">Filter</h2>
				<button type="reset" :form="formId" class="btn-outline-neutral h-10 px-4">Resetovať</button>
			</div>
		</template>

		<form :id="formId" :key="resetVersion" @reset="reset" @submit.prevent="close">
			<slot :active-filter-count="activeFilterCount" :is-filter-active="isFilterActive" :remove-filter="removeFilter" :toggle-filter="toggleFilter"></slot>
		</form>

		<template #footer>
			<button type="submit" :form="formId" class="btn-purple h-12 w-full justify-center">Zobraziť výsledky (24)</button>
		</template>
	</Drawer>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import Drawer from 'primevue/drawer'

const props = withDefaults(
	defineProps<{
		initialFilters?: string[]
	}>(),
	{
		initialFilters: () => []
	}
)

const visible = ref(false)
const resetVersion = ref(0)
const activeFilters = ref([...props.initialFilters])
const formId = `product-filters-${useId()}`
const activeFilterCount = computed(() => activeFilters.value.length)

const open = () => {
	visible.value = true
}

const close = () => {
	visible.value = false
}

const isFilterActive = (filter: string) => activeFilters.value.includes(filter)

const removeFilter = (filter: string) => {
	activeFilters.value = activeFilters.value.filter((activeFilter) => activeFilter !== filter)
}

const toggleFilter = (filter: string, checked: boolean) => {
	if (checked && !isFilterActive(filter)) {
		activeFilters.value = [...activeFilters.value, filter]
		return
	}

	if (!checked) removeFilter(filter)
}

const reset = () => {
	activeFilters.value = []
	resetVersion.value += 1
}
</script>
