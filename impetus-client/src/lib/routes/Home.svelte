<script>
	import NavigationBar from '$lib/components/NavigationBar.svelte';
	import Leaderboard from '$lib/components/Leaderboard.svelte';
	import Profile from '$lib/components/Profile.svelte';
	import Play from '$lib/components/Play.svelte';
	let currentTab;
</script>

<NavigationBar bind:currentTab />
{#if currentTab === 'play'}
	<Play />
{:else if currentTab === 'leaderboard'}
	<Leaderboard />
{:else if currentTab === 'profile'}
	<Profile />
{:else}
	<p>?</p>
{/if}

<style>
</style>
