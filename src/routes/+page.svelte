<script lang="ts">
	import Button from '$lib/Button.svelte';

	let rating = 1500;

	function start_matchmaking() {
		console.log('test');
	}

	function open_settings() {}

	function open_about() {}
</script>

<div id="center-lr">
	<div id="center-tb">
		<div id="root">
			<header>
				<h1>Elixir Duels</h1>
			</header>
			<main>
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
</style>
