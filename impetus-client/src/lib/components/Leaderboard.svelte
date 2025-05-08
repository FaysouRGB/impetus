<script>
	import { onMount } from 'svelte';

	let players = [];
	let isLoading = true;
	let error = null;

	onMount(async () => {
		try {
			const response = await fetch('/api/users/leaderboard');
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			players = await response.json();
		} catch (err) {
			error = err.message;
		} finally {
			isLoading = false;
		}
	});
</script>

{#if isLoading}
	<p>Loading...</p>
{:else if error}
	<p>Error: {error}</p>
{:else}
	<div class="flex w-full flex-col items-center space-y-4">
		{#each players as player}
			<div class="flex w-1/3 items-center space-x-4 rounded-full bg-slate-900 p-2">
				<img src={player.avatar} alt="Avatar" class="h-16 w-16 rounded-full" />
				<div>
					<h2 class="text-2xl font-bold">{player.username}</h2>
					<p class="text-lg">{player.score}pts</p>
				</div>
			</div>
		{/each}
	</div>
{/if}
