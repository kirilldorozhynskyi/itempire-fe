<template>
	<div />
</template>

<script>
export default {
	props: {
		async: {
			type: Boolean,
			default: false
		},
		defer: {
			type: Boolean,
			default: false
		},
		src: {
			type: String,
			required: true
		}
	},
	mounted() {
		const script = document.createElement('script')

		script.src = this.src
		script.async = this.async
		script.defer = this.defer
		this.$el.appendChild(script)
	}
}
</script>
  
