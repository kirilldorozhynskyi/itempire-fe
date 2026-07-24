<template>
	<div ref="gallery" class="flex min-w-0 flex-col gap-8 lg:gap-12">
		<div class="min-w-0">
			<slot name="main" :active-index="activeIndex" />
		</div>

		<div v-show="total > 1" class="flex min-w-0 items-center gap-4">
			<button type="button" class="btn-outline-neutral shrink-0 p-2" :disabled="isPrevDisabled" aria-label="Previous image" @click="selectPrevious">
				<SvgIcon name="arrow-left" />
			</button>

			<div ref="emblaRef" class="min-w-0 flex-1 overflow-hidden">
				<div class="flex">
					<slot name="thumbnails" :active-index="activeIndex" :select="selectImage" />
				</div>
			</div>

			<button type="button" class="btn-outline-neutral shrink-0 p-2" :disabled="isNextDisabled" aria-label="Next image" @click="selectNext">
				<SvgIcon name="arrow-right" />
			</button>
		</div>
	</div>
</template>

<script setup>
import emblaCarouselVue from 'embla-carousel-vue'
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import SvgIcon from './SvgIcon.vue'

const lazyLoad = inject('lazyLoad', null)
const gallery = ref(null)
const total = ref(0)
const activeIndex = ref(0)
const [emblaRef, emblaApi] = emblaCarouselVue({ align: 'start', containScroll: 'trimSnaps' })

const isPrevDisabled = computed(() => activeIndex.value <= 0)
const isNextDisabled = computed(() => activeIndex.value >= total.value - 1)

const selectImage = (index) => {
	const lastIndex = Math.max(0, total.value - 1)
	activeIndex.value = Math.min(Math.max(0, Number(index) || 0), lastIndex)
	emblaApi.value?.scrollTo(activeIndex.value)
	lazyLoad?.update()
}

const selectPrevious = () => selectImage(activeIndex.value - 1)
const selectNext = () => selectImage(activeIndex.value + 1)

watch(emblaApi, (api) => api?.reInit(), { immediate: true })
onMounted(async () => {
	await nextTick()
	total.value = gallery.value?.querySelectorAll('[data-gallery-thumbnail]').length ?? 0
	emblaApi.value?.reInit()
	lazyLoad?.update()
})
</script>
