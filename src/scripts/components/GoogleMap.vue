<template>
	<div ref="mapSectionRef">
		<GoogleMap v-if="mapVisible" :api-key="apiKey" class="h-full w-full" :center="center" :zoom="zoom" :styles="theme" :libraries="[]" ref="googleMapRef">
			<slot />
		</GoogleMap>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

import { GoogleMap, CustomMarker } from 'vue3-google-map'

defineProps({
	apiKey: {
		type: String,
		required: true
	},
	center: {
		type: Object,
		required: true
	},
	zoom: {
		type: Number,
		default: 16
	}
})

const googleMapRef = ref(null)
const hoverInfo = ref(null)
const activeInfo = ref(null)
const mapVisible = ref(false)
const mapSectionRef = ref(null)

watch(
	() => googleMapRef.value?.ready,
	(ready) => {
		if (!ready) return

		const googleMap = googleMapRef.value.map

		// Close custom info window when clicking on the map background
		if (googleMap && google?.maps) {
			google.maps.event.addListener(googleMap, 'click', () => {
				activeInfo.value = null
			})
		}
	}
)

onMounted(() => {
	if (!('IntersectionObserver' in window)) {
		mapVisible.value = true
		return
	}

	const io = new IntersectionObserver(
		(entries, observer) => {
			const entry = entries[0]
			if (entry && entry.isIntersecting) {
				mapVisible.value = true
				observer.disconnect()
			}
		},
		{ rootMargin: '200px' }
	)

	if (mapSectionRef.value) io.observe(mapSectionRef.value)
})

const theme = ref([
	{
		featureType: 'water',
		elementType: 'geometry',
		stylers: [
			{
				color: '#e9e9e9'
			},
			{
				lightness: 17
			}
		]
	},
	{
		featureType: 'landscape',
		elementType: 'geometry',
		stylers: [
			{
				color: '#f5f5f5'
			},
			{
				lightness: 20
			}
		]
	},
	{
		featureType: 'road.highway',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#ffffff'
			},
			{
				lightness: 17
			}
		]
	},
	{
		featureType: 'road.highway',
		elementType: 'geometry.stroke',
		stylers: [
			{
				color: '#ffffff'
			},
			{
				lightness: 29
			},
			{
				weight: 0.2
			}
		]
	},
	{
		featureType: 'road.arterial',
		elementType: 'geometry',
		stylers: [
			{
				color: '#ffffff'
			},
			{
				lightness: 18
			}
		]
	},
	{
		featureType: 'road.local',
		elementType: 'geometry',
		stylers: [
			{
				color: '#ffffff'
			},
			{
				lightness: 16
			}
		]
	},
	{
		featureType: 'poi',
		elementType: 'geometry',
		stylers: [
			{
				color: '#f5f5f5'
			},
			{
				lightness: 21
			}
		]
	},
	{
		featureType: 'poi.park',
		elementType: 'geometry',
		stylers: [
			{
				color: '#dedede'
			},
			{
				lightness: 21
			}
		]
	},
	{
		elementType: 'labels.text.stroke',
		stylers: [
			{
				visibility: 'on'
			},
			{
				color: '#ffffff'
			},
			{
				lightness: 16
			}
		]
	},
	{
		elementType: 'labels.text.fill',
		stylers: [
			{
				saturation: 36
			},
			{
				color: '#333333'
			},
			{
				lightness: 40
			}
		]
	},
	{
		elementType: 'labels.icon',
		stylers: [
			{
				visibility: 'off'
			}
		]
	},
	{
		featureType: 'transit',
		elementType: 'geometry',
		stylers: [
			{
				color: '#f2f2f2'
			},
			{
				lightness: 19
			}
		]
	},
	{
		featureType: 'administrative',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#fefefe'
			},
			{
				lightness: 20
			}
		]
	},
	{
		featureType: 'administrative',
		elementType: 'geometry.stroke',
		stylers: [
			{
				color: '#fefefe'
			},
			{
				lightness: 17
			},
			{
				weight: 1.2
			}
		]
	}
])
</script>
