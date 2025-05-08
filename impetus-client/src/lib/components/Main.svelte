<script>
	import Nav from '$lib/components/NavigationBar.svelte';
	import Leaderboard from './Leaderboard.svelte';
	import Profile from './Profile.svelte';
	import { fade } from 'svelte/transition';
	import Play from './Play.svelte';

	let currentTab;
</script>

<div class="flex h-full w-full flex-col items-center justify-between">
	<Nav bind:currentTab />
	<div class="flex w-full flex-1 items-center justify-center">
		{#if currentTab === 'play'}
			<Play />
		{:else if currentTab === 'leaderboard'}
			<Leaderboard />
		{:else if currentTab === 'profile'}
			<Profile />
		{:else}
			<p>?</p>
		{/if}
	</div>
</div>
