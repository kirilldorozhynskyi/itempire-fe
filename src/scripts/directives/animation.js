import { useIntersectionObserver } from '@vueuse/core'

export default {
	mounted(el, binding) {
		const { effect = 'fade-up', once = false, delay = 0, duration = 2000 } = binding.value || {}

		// Base classes
		el.classList.add('jd-init', effect)

		// Delay and duration styles
		el.style.transitionDelay = `${delay}ms`
		el.style.transitionDuration = `${duration}ms`

		const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
			if (isIntersecting) {
				el.classList.add('jd-animate')

				// After the animation ends, clean everything up
				const onTransitionEnd = () => {
					el.classList.remove('jd-init', 'jd-animate', effect)
					el.style.transitionDelay = ''
					el.style.transitionDuration = ''
					el.removeEventListener('transitionend', onTransitionEnd)
				}
				el.addEventListener('transitionend', onTransitionEnd)

				// If once = true, stop observing after the first intersection
				if (once) stop()
			}
		})
	}
}
