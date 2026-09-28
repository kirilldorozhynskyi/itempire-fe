import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { setTimeout } from 'node:timers/promises'
import test from 'node:test'

test('Nginx serves page routes behind an HTTPS proxy', async (t) => {
	const directory = mkdtempSync(path.join(os.tmpdir(), 'itempire-nginx-'))
	const docker = (...args) => execFileSync('docker', args, { encoding: 'utf8' }).trim()
	let container

	try {
		const fixtures = {
			'index.html': 'home',
			'cart-empty/index.html': 'empty cart',
			'cart/index.html': 'cart',
			'forgot-password/index.html': 'password',
			'products/detail.html': 'detail',
			'kontakt.html': 'contact',
			'assets/app.css': 'body {}',
			'404.html': 'not found'
		}

		for (const [file, content] of Object.entries(fixtures)) {
			const target = path.join(directory, file)
			mkdirSync(path.dirname(target), { recursive: true })
			writeFileSync(target, content)
		}

		container = docker(
			'run',
			'--detach',
			'--rm',
			'--pull=never',
			'--publish',
			'127.0.0.1::80',
			'--volume',
			`${directory}:/usr/share/nginx/html:ro`,
			'--volume',
			`${path.resolve('deploy/nginx.conf')}:/etc/nginx/conf.d/default.conf:ro`,
			'nginx:1.27-alpine'
		)
		docker('exec', container, 'nginx', '-t')
		const address = docker('port', container, '80/tcp')
		const request = (route) =>
			fetch(`http://${address}${route}`, {
				redirect: 'manual',
				headers: { Host: 'itempire.justdev.link', 'X-Forwarded-Proto': 'https' }
			})

		for (let attempt = 0; ; attempt++) {
			try {
				await request('/')
				break
			} catch (error) {
				if (attempt === 20) throw error
				await setTimeout(100)
			}
		}

		for (const [route, body] of [
			['/', 'home'],
			['/cart-empty/', 'empty cart'],
			['/cart/', 'cart'],
			['/forgot-password/', 'password'],
			['/products/detail/', 'detail'],
			['/kontakt/', 'contact'],
			['/kontakt.html', 'contact'],
			['/assets/app.css', 'body {}']
		]) {
			await t.test(route, async () => {
				const response = await request(route)
				assert.equal(response.status, 200)
				assert.equal(await response.text(), body)
			})
		}

		await t.test('canonical redirect preserves scheme and query', async () => {
			const response = await request('/cart-empty?from=checkout')
			assert.equal(response.status, 308)
			assert.equal(response.headers.get('location'), '/cart-empty/?from=checkout')
		})
		await t.test('missing page remains a 404', async () => {
			const response = await request('/missing/')
			assert.equal(response.status, 404)
			assert.equal(await response.text(), 'not found')
		})
	} finally {
		if (container) docker('rm', '--force', container)
		rmSync(directory, { recursive: true, force: true })
	}
})
