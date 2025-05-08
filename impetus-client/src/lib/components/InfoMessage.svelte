<script>
	let { title, message, loading } = $props();
</script>

<div class="panel">
	<h1>{title}</h1>
	<p>{message}</p>
</div>

<style>
	@import 'tailwindcss';

	.panel {
		@apply flex flex-col rounded-sm border border-white/20 bg-white/5 p-4 text-center shadow-md;
		animation: float 2s ease-in-out infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-4px);
		}
	}
</style>
