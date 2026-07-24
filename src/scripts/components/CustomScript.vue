<template>
	<div />
</template>

<script>
/* eslint-disable */
import postscribe from 'postscribe'

export default {
	props: {
		src: {
			type: String,
			required: true
		}
	},
	mounted() {
		let script = `<script>`
		script += this.src
		script += '<\/script>'
		postscribe(this.$el, script)
	}
}
</script>
