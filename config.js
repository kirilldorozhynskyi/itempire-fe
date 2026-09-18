/*
 * File: /config.js
 * Project: itempire-fe
 * Version: 1.0.0
 * Created Date: Thursday, September 28th 2023, 14:36:16
 * Author: Kirill Dorozhynskyi - kyrylo.dorozhynskyi@justdev.org
 * -----
 * Last Modified: Monday, July 27th 2026 16:38:42
 * Modified By: Kirill Dorozhynskyi
 * -----
 * Copyright (c) 2026 justDev
 */

const features = {
	eshop: false,
	testimonials: false
}

const isBuildEnabled = (build) => {
	if (build === undefined) {
		return true
	}

	if (typeof build !== 'string' || build.trim() === '') {
		throw new TypeError('Build flag must be a non-empty string')
	}

	if (!Object.hasOwn(features, build)) {
		throw new ReferenceError(`Unknown build flag: ${build}`)
	}

	return features[build] === true
}

const config = {
	base: './',
	rootDir: 'src',
	buildDir: 'dist',
	assetsDir: 'src/public/assets',
	features,
	fonts: {
		dev: 'src/resources/fonts',
		fix: '/assets/build/',
		prod: './'
	},

	htmlMinify: {
		enable: false,
		options: {
			collapseWhitespace: true,
			removeAttributeQuotes: false,
			removeComments: true,
			sortAttributes: true,
			sortClassName: true
		}
	},
	htmlBeautify: {
		inDir: 'dist',
		html: {
			enabled: true
		},
		js: {
			enabled: false
		},
		css: {
			enabled: false
		}
	},
	imageOptimizer: {
		test: /\.(jpe?g|png|gif|webp|svg)$/i,
		png: {
			quality: 90,
			compressionLevel: 9
		},
		jpeg: {
			quality: 20,
			mozjpeg: true
		},
		jpg: {
			quality: 20,
			mozjpeg: true
		},
		webp: {
			quality: 75,
			lossless: false
		},
		svg: {
			plugins: [
				{
					name: 'preset-default',
					params: {
						overrides: {
							cleanupIds: false,
							removeHiddenElems: false
						}
					}
				}
			]
		}
	},
	SvgSpritemap: {
		prefix: 'icon-',
		output: {
			filename: '[name]-[hash][extname]',
			name: 'spritemap.svg',
			view: true,
			use: true
		},
		svgo: {
			plugins: [
				{
					name: 'removeStyleElement'
				},
				{
					name: 'cleanupIDs'
				},
				{
					name: 'removeTitle'
				},
				{
					name: 'removeViewBox'
				},
				{
					name: 'removeUselessStrokeAndFill'
				},
				{
					name: 'removeAttrs',
					params: {
						attrs: '(fill|stroke)'
					}
				}
			]
		},
		injectSvgOnDev: true
	}
}

export { features, isBuildEnabled }
export default config
