import fs from 'node:fs'
import path from 'node:path'

const normalizePath = (value) => value.split(path.sep).join('/')

const getJsonFiles = (directory) => {
	return fs
		.readdirSync(directory, { withFileTypes: true })
		.sort((a, b) => a.name.localeCompare(b.name))
		.flatMap((entry) => {
			const entryPath = path.join(directory, entry.name)

			if (entry.isDirectory()) {
				return getJsonFiles(entryPath)
			}

			return entry.isFile() && entry.name.endsWith('.json') ? [entryPath] : []
		})
}

export const shouldBuildPage = (page, isBuildEnabled) => isBuildEnabled(page.build)

export const getDisabledPageFiles = ({ pagesDir, isBuildEnabled }) => {
	return getJsonFiles(pagesDir).filter((file) => {
		const page = JSON.parse(fs.readFileSync(file, 'utf8'))

		return !shouldBuildPage(page, isBuildEnabled)
	})
}

export const filterPageInputs = (inputs, disabledPageFiles) => {
	if (!Array.isArray(inputs)) {
		return inputs
	}

	return inputs.filter((input) => {
		if (typeof input !== 'string') {
			return true
		}

		const sourceFile = normalizePath(input.replace(/\.html$/, ''))

		return !disabledPageFiles.has(sourceFile)
	})
}

const pageFeatures = ({ pagesDir, isBuildEnabled }) => {
	return {
		name: 'itempire-page-features',
		enforce: 'post',
		config(config) {
			const disabledPageFiles = new Set(getDisabledPageFiles({ pagesDir, isBuildEnabled }).map(normalizePath))

			if (disabledPageFiles.size === 0 || !config.build) {
				return
			}

			const optionNames = ['rolldownOptions', 'rollupOptions']

			optionNames.forEach((optionName) => {
				const options = config.build[optionName]

				if (options?.input) {
					options.input = filterPageInputs(options.input, disabledPageFiles)
				}
			})
		}
	}
}

export default pageFeatures
