<script>
	import { user, isLoading, error, fetchUser, logout } from '../stores/auth';
	import { onMount } from 'svelte';
	import Main from '../lib/components/Main.svelte';
	import Login from '$lib/routes/Login.svelte';
	import Home from '$lib/routes/Home.svelte';
	import InfoMessage from '$lib/components/InfoMessage.svelte';

	onMount(async () => {
		await fetchUser();
	});
</script>

<section>
	{#if $isLoading}
		<InfoMessage
			title="🔃 Loading"
			message="Connecting to Impetus servers, please wait..."
			loading="true"
		/>
	{:else if $error}
		<InfoMessage
			title="🛑 Error"
			message={`An error occurred while connecting to Impetus servers: ${error}. Please try again later.`}
			loading="false"
		/>
	{:else if $user}
		<Home />
	{:else}
		<Login />
	{/if}
</section>

<style>
	@import 'tailwindcss';
</style>
