<script lang="ts">
	import { goto } from '$app/navigation';
	import { socket } from '$lib/socket';
	import Spinner from '$lib/Spinner.svelte';
	import { onDestroy } from 'svelte';
	import { derived, writable } from 'svelte/store';

	// from https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95
	function animationInterval(ms: any, signal: any, callback: any) {
		// Prefer currentTime, as it'll better sync animtions queued in the
		// same frame, but if it isn't supported, performance.now() is fine.
		const start = document.timeline ? document.timeline.currentTime : performance.now();

		function frame(time: any) {
			if (signal.aborted) return;
			callback(time);
			scheduleFrame(time);
		}

		function scheduleFrame(time: any) {
			const elapsed = time - start!;
			const roundedElapsed = Math.round(elapsed / ms) * ms;
			const targetNext = start! + roundedElapsed + ms;
			const delay = targetNext - performance.now();
			setTimeout(() => requestAnimationFrame(frame), delay);
		}

		scheduleFrame(start);
	}

	const counter = writable(0);
	const seconds = derived(counter, (counter) => counter % 60);
	const minutes = derived([counter, seconds], ([counter, seconds]) => (counter - seconds) / 60);

	const to_string_num_two_places = (n: number) => {
		if (n < 10) return '0' + n.toString();
		return n.toString();
	};

	const timer = derived(
		[minutes, seconds],
		([minutes, seconds]) =>
			to_string_num_two_places(minutes) + ':' + to_string_num_two_places(seconds)
	);

	const controller = new AbortController();
	animationInterval(1000, controller.signal, () => {
		counter.update((i) => i + 1);
	});

	onDestroy(() => controller.abort());

	const lobby_channel = derived(socket, (socket) => {
		if (!socket) return;
		const channel = socket.channel('matchmaking:lobby');
		channel.join();
		return channel;
	});

	onDestroy(() => $socket?.channel('matchmaking:lobby').leave());

	lobby_channel.subscribe((lobby_channel) => {
		if (!lobby_channel) return;
		const ref = lobby_channel.on('game_found', ({ game_id }) => {
			goto('/game/' + game_id);
		});
		onDestroy(() => lobby_channel.off('game_found', ref));
	});

	let queue_count = 10;
</script>

<div id="center-lr">
	<div id="center-tb">
		<div id="root">
			<header>
				<h1>Elixir Duels</h1>
			</header>
			<main>
				<h3>Matchmaking...</h3>
				<div id="display">
					<span id="queue-count">In Queue: {queue_count}</span><span id="timer">{$timer}</span>
				</div>
				<div id="spinner"><Spinner /></div>
			</main>
		</div>
	</div>
</div>

<style>
	#display {
		display: flex;
		flex-direction: row;
		gap: var(--size-s);
	}

	#queue-count {
		flex-grow: 1;
	}

	#timer {
		flex-grow: 1;
	}

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

	#spinner {
		width: 60%;
		margin: 20%;
		aspect-ratio: 1/1;
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
		align-self: center;
		gap: var(--size-xl);
		text-align: center;
		width: 100%;
	}
</style>
