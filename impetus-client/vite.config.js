import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		proxy: {
			'/api': {
				target: 'https://art-freelance-tomato-perfect.trycloudflare.com',
				changeOrigin: true
			}
		},
		allowedHosts: ['8d3d-77-129-222-71.ngrok-free.app']
	}
});
