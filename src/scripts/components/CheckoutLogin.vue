<template>
	<p>
		Máte už účet?
		<button
			type="button"
			class="text-purple focus-visible:outline-purple cursor-pointer font-medium underline focus-visible:outline-2 focus-visible:outline-offset-2"
			aria-haspopup="dialog"
			@click="visible = true"
		>
			Prihláste sa
		</button>
	</p>

	<Dialog v-model:visible="visible" header="Prihláste sa" modal :draggable="false" class="w-[calc(100%_-_3rem)] max-w-145">
		<form action="/shipping/" class="flex flex-col gap-5">
			<FloatField id="checkout-login-email" label="E-mail" name="login_email" field-type="email" autocomplete="email" placeholder="Zadajte váš e-mail" />
			<FloatField
				id="checkout-login-password"
				label="Heslo"
				name="login_password"
				field-type="password"
				autocomplete="current-password"
				placeholder="Zadajte heslo"
			/>
			<a href="/forgot-password/" class="text-purple self-end text-sm underline">Zabudli ste heslo?</a>
			<button type="submit" class="btn-purple w-full justify-center">Prihlásiť sa</button>
			<p class="text-center">Alebo sa prihláste cez:</p>
			<div class="grid grid-cols-2 gap-4">
				<button type="button" class="btn-outline-neutral"><SvgIcon name="apple" /> Apple</button>
				<button type="button" class="btn-outline-neutral"><SvgIcon name="google" /> Google</button>
			</div>
		</form>
	</Dialog>
</template>

<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import FloatField from './FloatField.vue'
import SvgIcon from './SvgIcon.vue'

const visible = ref(false)
</script>
