<script>
	import { onMount, onDestroy } from 'svelte';

	let dilemmaIndex = 0;
	let inGame = false;
	let dilemmas = [];
	let isLoading = true;
	let error = null;
	let pollInterval;

	onMount(() => {
		fetchDilemmas();
		pollInterval = setInterval(fetchDilemmas, 3000);
	});

	onDestroy(() => {
		clearInterval(pollInterval);
	});

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

	let currentGame;
	let currentPlayers = [];

	async function startGame(index) {
		isLoading = true;
		dilemmaIndex = index;
		inGame = true;

		await fetch(`/api/dilemmas/${dilemmas[dilemmaIndex]._id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		}).then(async (response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			currentGame = await response.json();
			console.log(currentGame);
		});

		if (!currentGame) {
			isLoading = false;
			return;
		}

		currentPlayers = [];

		// Fetch the players
		for (const playerId of currentGame.players) {
			await fetchPlayerById(playerId.playerId).then((player) => {
				currentPlayers.push(player);
				console.log(player);
			});
		}
		console.log(currentPlayers);
		isLoading = false;
	}

	async function fetchPlayerById(playerId) {
		return fetch(`/api/auth/${playerId}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(async (response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return await response.json();
			})
			.catch((err) => {
				error = err.message;
			});
	}

	async function endGame(choiceIndex) {
		isLoading = true;
		error = null;

		await fetch(`/api/dilemmas/${dilemmas[dilemmaIndex]._id}/${choiceIndex}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.catch((err) => {
				error = err.message;
			})
			.finally(async () => {
				await fetchDilemmas();
				inGame = false;
				isLoading = false;
			});
	}
</script>

{#if isLoading}
	<p>Loading...</p>
{:else if error}
	<p>Error: {error}</p>
{:else if inGame}
	<div class="flex flex-col text-center">
		<h1>{dilemmas[dilemmaIndex].title}</h1>
		{#if currentGame}
			<span
				>You're playing with:
				{#each currentPlayers as currentPlayer, index}
					<span>{currentPlayer.username}</span>
				{/each}
			</span>
		{:else}
			<span>You're the one creating the game!</span>
		{/if}

		<p>{dilemmas[dilemmaIndex].question}</p>

		<div class="mt-4 space-x-4">
			{#each dilemmas[dilemmaIndex].choices as choice, index}
				<button on:click={() => endGame(index)} class="bg-slate-900 px-8 py-2">
					<h2 class="text-2xl font-bold">{choice}</h2>
				</button>
			{/each}
		</div>

		<div class="mt-4">
			<h2>Results:</h2>
			{#each dilemmas[dilemmaIndex].outcomes as outcome}
				<p>
					{#each outcome.counts as c, i}
						<span class="mr-2"> {c} {dilemmas[dilemmaIndex].choices[i]}</span>
					{/each}
					{'=>'}
					{#each outcome.scores as c, i}
						<span class="mr-2"> {c} to {dilemmas[dilemmaIndex].choices[i]}</span>
					{/each}
				</p>
			{/each}
		</div>
	</div>
{:else}
	<div class="flex w-full flex-col items-center justify-center space-y-4 text-center">
		{#each dilemmas as dilemma, index}
			<button
				on:click={() => startGame(index)}
				disabled={dilemma.unresolvedPending}
				class="flex w-1/3 flex-col items-center space-x-4 bg-slate-900 p-2 disabled:opacity-50"
			>
				<h2 class="text-2xl font-bold">{dilemma.title}</h2>
				<p>{dilemma.requiredPlayers} players</p>
			</button>
		{/each}
	</div>
{/if}
