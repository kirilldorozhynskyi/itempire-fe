// Twig generates these references after the spritemap plugin's module transform.
export default function spritemapHtml() {
	let base

	return {
		name: 'itempire-spritemap-html',
		apply: 'build',
		enforce: 'post',
		configResolved(config) {
			base = config.base.startsWith('.') ? '/' : config.base
		},
		generateBundle: {
			order: 'post',
			handler(_options, bundle) {
				const assets = Object.values(bundle).filter((asset) => asset.type === 'asset')
				const sprite = assets.find((asset) => asset.name === 'spritemap.svg' || asset.names?.includes('spritemap.svg'))
				const reference = /((?:xlink:)?href\s*=\s*["'])\/__spritemap(?=[#?"'])/g

				for (const asset of assets) {
					if (!asset.fileName.endsWith('.html')) continue
					const html = typeof asset.source === 'string' ? asset.source : Buffer.from(asset.source).toString('utf8')
					if (!html.match(reference)) continue
					if (!sprite) this.error('Cannot resolve Twig SVG references: spritemap.svg was not emitted.')
					const url = `${base.replace(/\/$/, '')}/${sprite.fileName}`
					asset.source = html.replace(reference, (_match, attribute) => `${attribute}${url}`)
				}
			}
		}
	}
}
