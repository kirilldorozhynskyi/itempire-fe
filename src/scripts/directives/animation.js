export default {
	mounted(el, binding) {
		const { effect = 'fade-up', once = false, delay = 0, duration = 2000 } = binding.value || {}

		el.classList.add('jd-init', effect)
		el.style.transitionDelay = `${delay}ms`
		el.style.transitionDuration = `${duration}ms`

		const cleanup = () => {
			el.classList.remove('jd-init', 'jd-animate', effect)
			el.style.transitionDelay = ''
			el.style.transitionDuration = ''
			el.removeEventListener('transitionend', cleanup)
		}

		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting) {
				return
			}

			el.classList.add('jd-animate')
			el.addEventListener('transitionend', cleanup)

			if (once) {
				observer.disconnect()
			}
		})

		observer.observe(el)
		el.__jdAnimationObserver = observer
	},

	unmounted(el) {
		el.__jdAnimationObserver?.disconnect()
		delete el.__jdAnimationObserver
	}
}
