<template>
	<slot name="trigger" :open="open"></slot>

	<Drawer v-model:visible="visible" position="right" class="!w-full sm:!w-96">
		<template #header>
			<div class="flex min-w-0 flex-1 items-center justify-between gap-4">
				<h2 class="font-serif text-2xl font-semibold">Filter</h2>
				<button type="button" class="text-sm underline" @click="reset">Resetovať</button>
			</div>
		</template>

		<slot></slot>

		<template #footer>
			<button type="button" class="btn-purple w-full justify-center" @click="close">Zobraziť výsledky (344)</button>
		</template>
	</Drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Drawer from 'primevue/drawer'

const visible = ref(false)

const open = () => {
	visible.value = true
}

const close = () => {
	visible.value = false
}

const reset = () => {
	document.querySelectorAll<HTMLInputElement>('.mobile-product-filters input').forEach((input) => {
		if (input.type === 'checkbox') {
			input.checked = false
		}
	})
}
</script>
