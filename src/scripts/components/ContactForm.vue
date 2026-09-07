<template>
	<form ref="form" v-bind="$attrs" :aria-busy="isSubmitting" novalidate @submit.prevent="submit">
		<slot />

		<p v-if="statusMessage" ref="status" :class="['text-sm', isSuccess ? 'text-success' : 'text-error']" :role="isSuccess ? 'status' : 'alert'" tabindex="-1">
			{{ statusMessage }}
		</p>

		<button type="submit" class="btn-purple w-full justify-center" :disabled="isSubmitting">
			{{ isSubmitting ? submittingLabel : submitLabel }}
		</button>
	</form>
</template>

<script setup>
import { nextTick, ref } from 'vue'

defineOptions({ inheritAttrs: false })

defineProps({
	submitLabel: {
		type: String,
		required: true
	},
	submittingLabel: {
		type: String,
		default: 'Odosielam…'
	}
})

const form = ref(null)
const status = ref(null)
const statusMessage = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)

const focusStatus = async () => {
	await nextTick()
	status.value?.focus()
}

const submit = async () => {
	if (isSubmitting.value) return

	isSuccess.value = false
	statusMessage.value = ''

	if (!form.value?.reportValidity()) return

	isSubmitting.value = true

	try {
		const response = await fetch(form.value.action, {
			method: form.value.method,
			headers: {
				Accept: 'application/json'
			},
			body: new FormData(form.value)
		})
		const data = await response.json().catch(() => null)

		if (!response.ok) {
			throw new Error(data?.message || 'Správu sa nepodarilo odoslať. Skúste to, prosím, znova.')
		}

		isSuccess.value = true
		statusMessage.value = data?.message || 'Ďakujeme, správa bola úspešne odoslaná.'
	} catch (error) {
		statusMessage.value = error instanceof Error ? error.message : 'Správu sa nepodarilo odoslať. Skúste to, prosím, znova.'
	} finally {
		isSubmitting.value = false
		focusStatus()
	}
}
</script>
