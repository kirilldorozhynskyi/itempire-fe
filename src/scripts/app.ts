/*
 * File: /src/scripts/app.ts
 * Project: itempire-fe
 * Version: 1.0.0
 * Created Date: Sunday, September 24th 2023, 12:07:59
 * Author: Kirill Dorozhynskyi - kyrylo.dorozhynskyi@justdev.org
 * -----
 * Last Modified: Wednesday, July 22nd 2026 17:17:59
 * Modified By: Kirill Dorozhynskyi
 * -----
 * Copyright (c) 2026 justDev
 */

import '../styles/app.css'

// NOTE: Include if needed
// import AOS from 'aos'

import LazyLoad from 'vanilla-lazyload'
import PrimeVue from 'primevue/config'
import { computed, createApp, defineComponent, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import Aura from '@primeuix/themes/aura'
import { CustomMarker as GoogleMarker } from 'vue3-google-map'
import Accordion from 'primevue/accordion'
import AccordionContent from 'primevue/accordioncontent'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import TabPanel from 'primevue/tabpanel'
import TabPanels from 'primevue/tabpanels'
import Tabs from 'primevue/tabs'

// Directives
import PhotoSwipeDirective from './directives/photoswipe'
import Animation from './directives/animation'
// import TooltipDirective from './directives/tooltip'
// import CopyClipboard from './directives/clipboard'

import PageHeader from './components/PageHeader.vue'
import Benefits from './components/Benefits.vue'
import CustomScript from './components/CustomScript.vue'
import CustomScriptSrc from './components/CustomScriptSrc.vue'
import DropDown from './components/DropDown.vue'
import FilterDrawer from './components/FilterDrawer.vue'
import FloatField from './components/FloatField.vue'
import GoogleMap from './components/GoogleMap.vue'
import ProductGallery from './components/ProductGallery.vue'
import ProfileActions from './components/ProfileActions.vue'
import QuantityInput from './components/QuantityInput.vue'
import Range from './components/Range.vue'
import ReviewDrawer from './components/ReviewDrawer.vue'
import ShowMore from './components/ShowMore.vue'
import SimpleGallery from './components/SimpleGallery.vue'
import SliderItem from './components/Slider/SliderItem.vue'
// import SliderVideo from './components/Slider/SliderVideo.vue'
import SliderWrapper from './components/Slider/SliderWrapper.vue'
import StarRating from './components/StarRating.vue'
import StepperView from './components/StepperView.vue'

const PREVENT_UNLOAD_SELECTORS = [
	'.ajax',
	'.download',
	'#scroll-to-top',
	'[download]',
	'[href^=\\#]',
	'[href*=ajax]',
	'[href^=javascript]',
	'[href^=mailto]',
	'[href^=tel]',
	'[href*=tx_typoscriptrendering]',
	'[target^=_blank]',
]
const SCROLL_OFFSET = 64

export const rootComponent = defineComponent({
	/* == GLOBAL COMPONENTS == */
	components: {
		PageHeader,
		SimpleGallery,
		Benefits,
		SliderWrapper,
		SliderItem,
		CustomScript,
		CustomScriptSrc,
		Tabs,
		TabList,
		Tab,
		TabPanels,
		TabPanel,
		Accordion,
		AccordionPanel,
		AccordionHeader,
		AccordionContent,
		StepperView,
		Range,
		ShowMore,
		DropDown,
		FilterDrawer,
		FloatField,
		ProductGallery,
		QuantityInput,
		ReviewDrawer,
		StarRating,
		ProfileActions,
		GoogleMap,
		GoogleMarker,
	},

	/* ======= OPTIONS ======= */
	delimiters: ['<%', '%>'],

	/* ======= DIRECTIVES ======= */
	directives: {
		photoswipe: PhotoSwipeDirective,
		jdAnimate: Animation,
	},

	/* ======== SETUP ======== */
	setup() {
		const activeAccordions = ref(initialAccordionValues)
		const lazyLoad = new LazyLoad({
			threshold: 0,
			elements_selector: '[lazy]',
			class_loading: 'lazy-loading',
			class_loaded: 'lazy-loaded',
			class_applied: 'lazy-bg-loaded',
			class_error: 'lazy-error',
		})
		const scrollOffset = computed(() => {
			const headerElement = document.querySelector<HTMLElement>('page-header header')

			return -(SCROLL_OFFSET + (headerElement?.offsetHeight ?? 0))
		})
		let unloadController: AbortController | null = null

		const createdHook = () => {
			/* Placeholder function used to extend Vue created hook in projects */
		}
		const loadedHook = () => {
			/* Placeholder function used to extend document on-load event in projects */
		}
		const mountedHook = () => {
			/* Placeholder function used to extend Vue mounted hook in projects */
		}

		const onDocumentClick = (event: MouseEvent) => {
			const target = event.target instanceof Element ? event.target.closest('a') : null

			if (!(target instanceof HTMLAnchorElement)) {
				return
			}

			if (target.matches(PREVENT_UNLOAD_SELECTORS.join(', '))) {
				return
			}

			if (event.defaultPrevented || event.ctrlKey || event.shiftKey || event.metaKey || event.button === 1) {
				return
			}

			if (target.id === 'history-back') {
				event.preventDefault()

				if (window.history.length > 1) {
					window.history.back()
				}

				return
			}

			const currentUrl = new URL(window.location.href)
			const targetUrl = new URL(target.href, window.location.href)

			if (targetUrl.origin === currentUrl.origin && targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) {
				return
			}

			document.body.classList.remove('loaded')
		}

		const initUnload = () => {
			unloadController?.abort()
			unloadController = new AbortController()

			document.addEventListener('click', onDocumentClick, {
				signal: unloadController.signal,
			})
		}

		const onLoad = () => {
			document.body.classList.add('loaded')
			initUnload()
			loadedHook()
		}

		const onScroll = () => {
			const scrollToTopButton = document.querySelector<HTMLElement>('.page-return-top')

			if (!scrollToTopButton) {
				return
			}

			scrollToTopButton.classList.toggle('active', window.scrollY >= 200)
		}

		const scrollToTop = () => {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}

		provide('lazyLoad', lazyLoad)
		provide('scrollOffset', scrollOffset)
		createdHook()

		onMounted(() => {
			// AOS.init({
			// 	duration: 900,
			// 	once: true,
			// })

			if (document.readyState === 'complete') {
				onLoad()
			} else {
				window.addEventListener('load', onLoad, { once: true })
			}

			window.addEventListener('scroll', onScroll, { passive: true })
			onScroll()
			lazyLoad.update()
			document.body.classList.add('loaded')
			mountedHook()
		})

		onBeforeUnmount(() => {
			window.removeEventListener('load', onLoad)
			window.removeEventListener('scroll', onScroll)
			unloadController?.abort()
		})

		return {
			activeAccordions,
			lazyLoad,
			scrollOffset,
			scrollToTop,
		}
	},
})

const initialAccordionValues = Array.from(document.querySelectorAll('accordion-panel'), (panel) => panel.getAttribute('value')).filter(Boolean)

const app = createApp(rootComponent)
app.use(PrimeVue, {
	theme: {
		preset: Aura,
		// Default options
		options: {
			prefix: 'p',
			darkModeSelector: false,
			cssLayer: false,
			cssVariables: true,
		},
	},
	license:
		'eyJpZCI6ImEyNzE0NDhkLTRkNWQtNGJmNy1iNTM2LTQzZThmMzJlNmViNiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODQ1NDg2NDQsImV4cCI6MTgxNjA4NDY0NH0.hRslFQGjywHr2JlYiS9kXkrgVJFN_i-FKVXOiJHlOeQmDcot305RKO6A3o6fmfzCiIOoTMypuZuo_mhQksxWCA',
})
app.config.compilerOptions.isCustomElement = (tag) => tag === 'nobr'

const appRoot = document.querySelector('#app')

if (appRoot) {
	app.mount(appRoot)
}
