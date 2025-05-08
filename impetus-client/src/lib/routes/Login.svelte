<script>
</script>

<div class="panel">
	<h1>Welcome</h1>
	<p>To monitor your progress, please log in with your Discord account.</p>
	<button on:click={(window.location.href = '/api/auth/discord')}>Sign In with Discord</button>
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

	button {
		@apply relative mt-8 flex items-center justify-center overflow-hidden rounded-sm border border-white/20 bg-[#5865F2] py-2 font-medium;
	}

	button::before {
		content: '';
		background-image: url('/discord_symbol.svg');
		@apply mr-2 inline-block h-5 w-5 bg-contain bg-center bg-no-repeat;
	}

	button::after {
		@apply absolute inset-y-0 w-1/2;
		content: '';
		left: -75%;
		background: linear-gradient(120deg, #ffffff00 0%, #ffffff66 50%, #ffffff00 100%);
	}

	button:hover::after {
		animation: shine 1s ease-in-out;
	}

	@keyframes shine {
		0% {
			left: -75%;
		}
		100% {
			left: 125%;
		}
	}
</style>
