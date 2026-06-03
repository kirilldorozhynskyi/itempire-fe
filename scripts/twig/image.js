/*
 * File: /scripts/twig/image.js
 * Project: starter_frontend_twig
 * Version: 2.2.8
 * Created Date: Thursday, September 28th 2023, 17:20:01
 * Author: Kirill Dorozhynskyi - kyrylo.dorozhynskyi@justdev.org
 * -----
 * Last Modified: Tuesday, May 28th 2024 15:29:46
 * Modified By: Kirill Dorozhynskyi
 * -----
 * Copyright (c) 2024 justDev
 */

const escapeAttribute = (value) =>
	String(value ?? '')
		.replaceAll('&', '&amp;')
		.replaceAll('"', '&quot;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')

const renderAttributes = (attributes = {}) =>
	Object.entries(attributes)
		.filter(([, value]) => value !== undefined && value !== null && value !== false)
		.map(([name, value]) => (value === true ? name : `${name}="${escapeAttribute(value)}"`))
		.join(' ')

const twigFunctionsImage = (img, options = {}) => {
	const path = '/assets/images/'

	const pictureClass = img.pictureClass ?? 'picture'
	const image = img.image
	const lazy = options.lazy ?? img.lazy ?? true
	const srcsetAttribute = lazy ? 'data-srcset' : 'srcset'
	const defaultSrcset = `${path}${image.src}.${image.ext} 1x, ${path}${image.src_2x ?? image.src}.${image.ext} 2x`
	const imageAttributes = renderAttributes({
		loading: options.loading,
		decoding: options.decoding,
		fetchpriority: options.fetchpriority,
		...options.attrs
	})

	// TODO: breakpoints
	// const breakpoints = img.breakpoints

	const webpImage =
		image.webp && process.env.NODE_ENV != 'development'
			? `<source ${srcsetAttribute}="${path}${image.src}.webp 1x,  ${path}${image.src_2x ?? image.src}.webp 2x" />`
			: ''
	const defaultImage = image.webp ? `<source ${srcsetAttribute}="${defaultSrcset}" />` : ''

	return `<picture class="${pictureClass}">
	${webpImage}
	${defaultImage}
	<img alt="${image.alt ?? 'alt text'}"
		${lazy ? 'lazy' : ''}
		class="${image.class ? image.class : ''}"
		src="${
			lazy
				? `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${image.width ?? ''} ${image.height ?? ''}'%3E%3C/svg%3E`
				: `${path}${image.src}.${image.ext}`
		}"
		${srcsetAttribute}="${defaultSrcset}" width="${image.width ?? ''}" height="${
		image.height ?? ''
	}" ${imageAttributes} />
	</picture>`
}

export default twigFunctionsImage
