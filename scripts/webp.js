/*
 * File: /scripts/webp.js
 * Project: starter_frontend_twig
 * Version: 2.1.0
 * Created Date: Tuesday, July 19th 2022, 3:27:02
 * Author: Kirill Dorozhynskyi - kyrylo.dorozhynskyi@justdev.org
 * -----
 * Last Modified: Saturday, January 6th 2024 15:52:11
 * Modified By: Kirill Dorozhynskyi
 * -----
 * Copyright (c) 2024 justDev
 */

import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

async function convertImages(directory) {
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const source = path.join(directory, entry.name)
		if (entry.isDirectory()) {
			await convertImages(source)
		} else if (entry.isFile() && /\.(jpg|png)$/i.test(entry.name)) {
			const destination = source.replace(/\.(jpg|png)$/i, '.webp')
			await sharp(source).webp({ quality: 50 }).toFile(destination)
		}
	}
}

await convertImages('./src/public/assets/images')
console.log('Images converted to webp 🏞')
