<script>
	import { onMount } from 'svelte';
	import { logout } from '../../stores/auth';

	let player;
	let isLoading = true;
	let error = null;
	let matches = [];

	onMount(async () => {
		try {
			const response = await fetch('/api/users/profile', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			player = await response.json();
			await fetchDilemmas();
			await fetchAllPlayerMatches();
			console.log(matches);
		} catch (err) {
			error = err.message;
		} finally {
			isLoading = false;
		}
	});

	let dilemmas = [];

	async function fetchDilemmas() {
		try {
			const response = await fetch('/api/dilemmas/', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			dilemmas = await response.json();
		} catch (err) {
			error = err.message;
		} finally {
			isLoading = false;
		}
	}

	function getDilemmaFromId(id) {
		return dilemmas.find((dilemma) => dilemma._id === id);
	}

	async function fetchAllPlayerMatches() {
		await fetch(`/api/auth/${player.discordId}/history`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(async (response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				matches = await response.json();
			})
			.catch((error) => {
				console.error('Error fetching player matches:', error);
			});
	}

	function getMyPoints(match) {
		console.log(match);
		const scoreEntry = match.scores.find((score) => score.playerId === player.discordId);
		return scoreEntry.score;
	}
</script>

{#if isLoading}
	<p>Loading...</p>
{:else if error}
	<p>Error: {error}</p>
{:else}
	<div class="flex w-1/2 flex-col items-center justify-center">
		<div class="flex w-full items-center justify-between space-x-4 rounded-full bg-slate-900 p-2">
			<img src={player.avatar} alt="Avatar" class="h-16 w-16 rounded-full" />
			<div>
				<h2 class="text-2xl font-bold">{player.username}</h2>
				<p class="text-lg">{player.score}pts</p>
			</div>
			<button on:click={() => logout()}>Log out</button>
		</div>
		<div class="mt-4 flex max-h-[400px] w-full flex-col overflow-y-auto">
			{#each matches as match}
				<div
					class="{match.resolved
						? getMyPoints(match) >= 0
							? 'bg-green-500'
							: 'bg-red-500'
						: 'bg-gray-500'} my-1 w-full p-4"
				>
					<h2 class="text-2xl font-bold">{getDilemmaFromId(match.dilemmaId).title}</h2>
					<p class="text-lg">Created at: {new Date(match.createdAt).toLocaleDateString()}</p>
					<p class="text-lg">{match.resolved ? `${getMyPoints(match)}pts` : 'Not resolved'}</p>
				</div>
			{/each}
		</div>
	</div>
{/if}
