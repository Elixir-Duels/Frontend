<script lang="ts">
	import { goto } from '$app/navigation';
	import { login, signup, logged_in } from '$lib/auth';
	import Button from '$lib/Button.svelte';
	import { is_connected } from '$lib/socket';
	import Spinner from '$lib/Spinner.svelte';

	let rating = 1500;

	function start_matchmaking() {
		goto('/matchmaking');
	}

	function open_settings() {}

	function open_about() {}

	let username: string;
	let password: string;
</script>

<div id="center-lr">
	<div id="center-tb">
		<div id="root">
			<header>
				<h1>Elixir Duels</h1>
			</header>
			<main>
				{#if $logged_in}
					{#if !$is_connected}
						<div class="group">
							<Spinner />
						</div>
					{:else}
						<div class="group">
							<Button on:click|once={start_matchmaking}>
								<h4>Play</h4>
								<h5>Current Rating: {rating}</h5>
							</Button>
						</div>
						<div class="group">
							<Button on:click={open_settings}>
								<h4>Settings</h4>
							</Button>
							<Button on:click={open_about}>
								<h4>About</h4>
							</Button>
						</div>
					{/if}
				{:else}
					<div class="group">
						<input bind:value={username} type="text" placeholder="username" />
					</div>
					<div class="group">
						<input bind:value={password} type="password" placeholder="password" />
					</div>
					<div class="group">
						<Button on:click|once={() => signup(username, password)}><h4>Register</h4></Button>
						<Button on:click|once={() => login(username, password)}><h4>Sign In</h4></Button>
					</div>
				{/if}
			</main>
		</div>
	</div>
</div>

<style>
	#center-lr {
		display: flex;
		flex-direction: row;
		justify-content: center;
		height: 100vh;
		width: 100vw;
	}

	#center-tb {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100vh;
	}

	#root {
		display: flex;
		flex-direction: column;
		width: fit-content;
	}

	header {
		margin: var(--size-m);
		flex-grow: 0;
		height: fit-content;
	}

	header > h1 {
		text-align: center;
	}

	main {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-self: center;
		gap: var(--size-xl);
		align-items: center;
		width: 100%;
	}

	:global(main > *) {
		width: 100%;
	}

	:global(.group > *) {
		width: 100%;
	}

	.group {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: var(--size-xl);
	}

	.group > input {
		background-color: var(--color-secondary);
		color: var(--color-primary);
		outline: var(--outline-primary);
		box-shadow: var(--shadow-primary-xs);
		font-size: xx-large;
	}
</style>
