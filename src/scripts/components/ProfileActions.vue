<template>
	<slot :open-address="openAddress" :confirm-delete="confirmDelete"></slot>

	<Drawer v-model:visible="addressVisible" position="right" class="!w-full md:!w-145">
		<template #header>
			<slot name="address-header" :editing="editing"></slot>
		</template>

		<slot name="address" :close="closeAddress" :editing="editing"></slot>
	</Drawer>

	<Dialog v-model:visible="deleteVisible" modal :draggable="false" class="profile-delete-dialog mx-6 w-full max-w-145">
		<template #header>
			<slot name="delete-header"></slot>
		</template>

		<slot name="delete" :close="closeDelete"></slot>
	</Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Drawer from 'primevue/drawer'

const addressVisible = ref(false)
const deleteVisible = ref(false)
const editing = ref(false)

const openAddress = (mode = 'add') => {
	editing.value = mode === 'edit'
	addressVisible.value = true
}

const closeAddress = () => {
	addressVisible.value = false
}

const confirmDelete = () => {
	deleteVisible.value = true
}

const closeDelete = () => {
	deleteVisible.value = false
}
</script>
