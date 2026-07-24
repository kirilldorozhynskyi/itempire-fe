<template>
	<button type="button" class="btn-outline-neutral gap-2.5 px-4 py-2" @click="visible = true">
		<SvgIcon name="plus" class="text-2x!" />
		{{ buttonText }}
	</button>

	<Drawer v-model:visible="visible" position="right" class="!w-full md:!w-145">
		<template #header>
			<h2 class="font-serif text-2xl leading-tight font-semibold">{{ title }}</h2>
		</template>

		<slot :close="closeDrawer"></slot>
	</Drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Drawer from 'primevue/drawer'
import SvgIcon from './SvgIcon.vue'

withDefaults(
	defineProps<{
		buttonText?: string
		title?: string
	}>(),
	{
		buttonText: 'Pridať recenziu',
		title: 'Pridajte vaše hodnotenie'
	}
)

const visible = ref(false)

const closeDrawer = () => {
	visible.value = false
}
</script>
