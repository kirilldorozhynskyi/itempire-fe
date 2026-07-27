<template>
	<div />
</template>

<script>
export default {
	props: {
		src: {
			type: String,
			required: true
		}
	},
	mounted() {
		const script = document.createElement('script')

		script.textContent = this.src
		this.$el.appendChild(script)
	}
}
</script>
