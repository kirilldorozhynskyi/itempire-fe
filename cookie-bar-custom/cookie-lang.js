import './cookie.js'

const COOKIE_REVISION = 1809420234
const PRIVACY_URL = '/gdpr/'
const CONTACT_URL = '/kontakt/'
const CONSENT_DEFAULTS = {
	ad_storage: 'denied',
	ad_user_data: 'denied',
	ad_personalization: 'denied',
	analytics_storage: 'denied'
}

const initializeGoogleConsent = () => {
	window.dataLayer = window.dataLayer || []

	if (typeof window.gtag !== 'function') {
		window.gtag = function () {
			window.dataLayer.push(arguments)
		}
	}

	window.gtag('consent', 'default', CONSENT_DEFAULTS)
	window.gtag('set', 'ads_data_redaction', true)
	window.gtag('set', 'url_passthrough', false)
}

const initializeCookieConsent = () => {
	if (typeof window.initCookieConsent !== 'function' || document.getElementById('cc_div')) return

	initializeGoogleConsent()
	window._log = window._log || (() => {})

	const cookieName = `cc_cookie_${window.location.hostname}`
	const cookieDomain = ['localhost', '127.0.0.1'].includes(window.location.hostname) ? '' : window.location.hostname
	const consent = window.initCookieConsent()
	let lastConsentSignature = ''

	const applyConsent = (preferences = consent.getUserPreferences()) => {
		const acceptedCategories = preferences.accepted_categories || []
		const signature = [...acceptedCategories].sort().join(',')

		if (signature === lastConsentSignature) return

		lastConsentSignature = signature
		window.gtag('consent', 'update', {
			analytics_storage: acceptedCategories.includes('analytics') ? 'granted' : 'denied',
			ad_storage: acceptedCategories.includes('marketing') ? 'granted' : 'denied',
			ad_user_data: acceptedCategories.includes('marketing') ? 'granted' : 'denied',
			ad_personalization: acceptedCategories.includes('marketing') ? 'granted' : 'denied'
		})
		document.dispatchEvent(
			new CustomEvent('cookie-consent:change', {
				detail: { acceptedCategories }
			})
		)
	}

	consent.run({
		current_lang: 'sk',
		autoclear_cookies: true,
		theme_css: '',
		cookie_name: cookieName,
		cookie_expiration: 365,
		page_scripts: true,
		cookie_domain: cookieDomain,
		autorun: true,
		delay: 0,
		force_consent: false,
		hide_from_bots: true,
		remove_cookie_tables: false,
		cookie_path: '/',
		cookie_same_site: 'Lax',
		use_rfc_cookie: false,
		revision: COOKIE_REVISION,
		gui_options: {
			consent_modal: {
				layout: 'box',
				position: 'bottom left',
				transition: 'slide'
			},
			settings_modal: {
				layout: 'box',
				transition: 'slide'
			}
		},
		onFirstAction: applyConsent,
		onAccept: () => applyConsent(),
		onReject: () => applyConsent(),
		onChange: () => applyConsent(),
		languages: {
			sk: {
				consent_modal: {
					title: 'Používame cookies',
					description:
						'Nevyhnutné cookies zabezpečujú správne fungovanie stránky. S vaším súhlasom môžeme používať aj analytické a marketingové cookies. <button type="button" data-cc="c-settings" class="cc-link">Upraviť nastavenia</button>',
					primary_btn: {
						text: 'Prijať všetko',
						role: 'accept_all'
					},
					secondary_btn: {
						text: 'Len nevyhnutné',
						role: 'accept_necessary'
					}
				},
				settings_modal: {
					title: 'Nastavenia cookies',
					save_settings_btn: 'Uložiť nastavenia',
					accept_all_btn: 'Prijať všetko',
					reject_all_btn: 'Len nevyhnutné',
					close_btn_label: 'Zavrieť nastavenia cookies',
					cookie_table_headers: [{ col1: 'Názov' }, { col2: 'Doména' }, { col3: 'Platnosť' }, { col4: 'Účel' }],
					blocks: [
						{
							title: '',
							description: `Vyberte si, ktoré voliteľné cookies môžeme používať. Svoj výber môžete kedykoľvek zmeniť. Viac informácií nájdete v <a href="${PRIVACY_URL}" class="cc-link">zásadách ochrany súkromia</a>.`
						},
						{
							title: 'Nevyhnutné cookies',
							description: 'Tieto cookies sú potrebné na základné fungovanie stránky a nemožno ich vypnúť.',
							toggle: {
								value: 'necessary',
								enabled: true,
								readonly: true
							},
							cookie_table: [
								{
									col1: cookieName,
									col2: window.location.hostname,
									col3: '1 rok',
									col4: 'Uchováva vaše nastavenia súhlasu s cookies.',
									is_regex: false
								},
								{
									col1: '_grecaptcha',
									col2: 'google.com',
									col3: 'Bez expirácie',
									col4: 'Pomáha rozlíšiť používateľov od automatizovaných požiadaviek a chráni formuláre pred zneužitím.',
									is_regex: false
								}
							]
						},
						{
							title: 'Analytické cookies',
							description: 'Pomáhajú nám porozumieť návštevnosti a zlepšovať fungovanie stránky. Zapnú sa iba s vaším súhlasom.',
							toggle: {
								value: 'analytics',
								enabled: false,
								readonly: false
							},
							cookie_table: [
								{
									col1: '_ga',
									col2: window.location.hostname,
									col3: '2 roky',
									col4: 'Rozlišuje návštevníkov a vytvára anonymizované štatistiky používania stránky.',
									is_regex: false
								},
								{
									col1: '_gid',
									col2: window.location.hostname,
									col3: '1 deň',
									col4: 'Rozlišuje návštevníkov pri meraní návštevnosti stránky.',
									is_regex: false
								}
							]
						},
						{
							title: 'Marketingové cookies',
							description: 'Umožňujú merať účinnosť kampaní a prispôsobiť reklamu. Zapnú sa iba s vaším súhlasom.',
							toggle: {
								value: 'marketing',
								enabled: false,
								readonly: false
							},
							cookie_table: [
								{
									col1: 'test_cookie',
									col2: '.doubleclick.net',
									col3: '15 minút',
									col4: 'Overuje, či prehliadač podporuje súbory cookie používané reklamnými službami.',
									is_regex: false
								}
							]
						},
						{
							title: 'Viac informácií',
							description: `Ak máte otázky k používaniu cookies alebo svojmu výberu, <a class="cc-link" href="${CONTACT_URL}">kontaktujte nás</a>.`
						}
					]
				}
			}
		}
	})

	window.itempireCookieConsent = consent
}

export default initializeCookieConsent
