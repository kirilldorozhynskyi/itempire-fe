<template>
	<header
		ref="headerEl"
		class="transit sticky top-0"
		:class="[hidden ? '-translate-y-full' : 'translate-y-0', solid || menuOpened || cartOpened || searchOpened || activeSubmenu !== null ? 'bg-white' : ' ']"
	>
		<div>
			<slot
				:toggle-menu="toggleMenu"
				:menu-opened="menuOpened"
				:toggle-cart="toggleCart"
				:close-cart="closeCart"
				:cart-opened="cartOpened"
				:search-opened="searchOpened"
				:search-query="searchQuery"
				:update-search-query="updateSearchQuery"
				:open-search="openSearch"
				:close-search="closeSearch"
				:active-submenu="activeSubmenu"
				:active-submenu-item="activeSubmenuItem"
				:open-submenu="openSubmenu"
				:open-submenu-item="openSubmenuItem"
				:close-submenu="closeSubmenu"
			/>
		</div>
	</header>
</template>

<script setup>
import { nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'

// Header reveal behavior (sticky, so it never shifts the page content):
// - At the top of the page it sits in its natural position, transparent.
// - Scrolling down slides it up and out of view.
// - Scrolling up past the offset slides it back into view with an opaque background.
const REVEAL_OFFSET = 200 // px scrolled before the show/hide-on-direction behavior kicks in
const SCROLL_DELTA = 6 // min scroll movement to register a direction change (ignores jitter)

const headerEl = ref(null)
const lastScrollTop = ref(0)
const hidden = ref(false) // slid up and out (scrolling down)
const solid = ref(false) // opaque background once scrolled past the hero
const menuOpened = ref(false)
const cartOpened = ref(false)
const searchOpened = ref(false)
const searchQuery = ref('')
const activeSubmenu = ref(null)
const activeSubmenuItem = ref(1)

let ticking = false

const update = () => {
	ticking = false
	const currentScrollTop = Math.max(window.scrollY || 0, 0)
	const delta = currentScrollTop - lastScrollTop.value

	solid.value = currentScrollTop > REVEAL_OFFSET

	// Near the top — always visible, in its natural position.
	if (currentScrollTop <= REVEAL_OFFSET) {
		hidden.value = false
		lastScrollTop.value = currentScrollTop
		return
	}

	// Ignore sub-pixel jitter / trackpad momentum so the direction doesn't flip.
	if (Math.abs(delta) < SCROLL_DELTA) return

	// Scrolling down slides the header up and out; scrolling up brings it back.
	// It stays sticky (in flow), so the page content never jumps.
	hidden.value = delta > 0
	if (hidden.value) closeOverlays()

	lastScrollTop.value = currentScrollTop
}

const toggleMenu = () => {
	menuOpened.value = !menuOpened.value
	if (menuOpened.value) {
		closeSubmenu()
		closeCart()
	}
}

const closeCart = () => {
	cartOpened.value = false
}

const closeSearch = () => {
	searchOpened.value = false
}

const updateSearchQuery = (value) => {
	searchQuery.value = value
}

const openSearch = () => {
	searchOpened.value = true
	menuOpened.value = false
	closeCart()
	closeSubmenu()

	nextTick(() => {
		document.querySelector('#header-search-input')?.focus()
	})
}

const toggleCart = () => {
	cartOpened.value = !cartOpened.value

	if (cartOpened.value) {
		menuOpened.value = false
		closeSearch()
		closeSubmenu()
	}
}

const closeSubmenu = () => {
	activeSubmenu.value = null
	activeSubmenuItem.value = 1
}

const openSubmenu = (index) => {
	const nextIndex = Number(index)

	if (activeSubmenu.value === nextIndex) {
		closeSubmenu()
		return
	}

	activeSubmenu.value = nextIndex
	activeSubmenuItem.value = 1
	closeCart()
}

const openSubmenuItem = (index) => {
	activeSubmenuItem.value = Number(index)
}

const closeOverlays = () => {
	closeSubmenu()
	closeCart()
	closeSearch()
}

const handleDocumentClick = (event) => {
	if (!headerEl.value?.contains(event.target)) closeOverlays()
}

const handleKeydown = (event) => {
	if (event.key === 'Escape') closeOverlays()
}

watch([menuOpened, searchOpened], ([isMenuOpened, isSearchOpened]) => {
	document.body.classList.toggle('overflow-hidden', isMenuOpened || isSearchOpened)
})

const handleScroll = () => {
	// Throttle to one update per animation frame.
	if (ticking) return
	ticking = true
	window.requestAnimationFrame(update)
}

onMounted(() => {
	window.addEventListener('scroll', handleScroll, { passive: true })
	document.addEventListener('click', handleDocumentClick)
	document.addEventListener('keydown', handleKeydown)
	// Initialize state based on current position.
	update()
})

onBeforeUnmount(() => {
	window.removeEventListener('scroll', handleScroll)
	document.removeEventListener('click', handleDocumentClick)
	document.removeEventListener('keydown', handleKeydown)
	document.body.classList.remove('overflow-hidden')
})
</script>
