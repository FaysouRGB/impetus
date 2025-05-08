<script>
	const tabs = [
		{ name: 'play', icon: '✅' },
		{ name: 'leaderboard', icon: '🥇' },
		{ name: 'profile', icon: '😁' }
	];

	export let currentTab = tabs[0].name;
</script>

<nav class="panel">
	{#each tabs as tab}
		<button on:click={(currentTab = tab.name)} class={tab.name === currentTab ? '!opacity-100' : ''}
			>{`${tab.icon} ${tab.name}`}</button
		>
	{/each}
</nav>

<style>
	@import 'tailwindcss';

	.panel {
		@apply absolute top-4 flex w-1/2 justify-around rounded-sm border border-white/20 bg-white/5 p-4 text-center text-2xl shadow-md;
	}

	button {
		@apply uppercase opacity-50 transition-opacity hover:opacity-80;
	}
</style>
