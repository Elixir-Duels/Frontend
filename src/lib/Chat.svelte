<script lang="ts">
	import { is_connected, socket } from '$lib/socket';
	import { derived, writable, type Writable } from 'svelte/store';
	import type { Socket, Channel } from 'phoenix';
	import { afterUpdate } from 'svelte';
	import { browser } from '$app/environment';
	import Spinner from './Spinner.svelte';
	import { Presence } from 'phoenix';

	type Message = { id: string; author: string; content: string };

	let push_message: (message: string) => void;

	let global_chat = derived(socket, (socket: Socket | undefined) => socket?.channel('chat:global'));
	let global_presence = derived(global_chat, (global_chat) =>
		global_chat ? new Presence(global_chat) : undefined
	);
	let global_presence_list: Writable<
		Map<string, { meta: never /* todo: type properly */; user: { username: string } }> | undefined
	> = writable(undefined);
	const update_presence_list = (global_presence: Presence) => {
		let new_list = new Map();
		global_presence.list((key, presence) => {
			new_list.set(key, presence);
		});
		global_presence_list.set(new_list);
	};
	global_presence.subscribe((global_presence) => {
		if (global_presence) {
			global_presence.onSync(() => update_presence_list(global_presence));
			update_presence_list(global_presence);
		}
	});

	let message_store: Writable<Message[]> = writable([]);

	global_chat.subscribe(
		(global_chat: Channel | undefined) => {
			if (!global_chat) return;
			global_chat.on('new_msg', (r) => {
				message_store.update((m) => [...m, r]);
			});

			push_message = (message) => {
				global_chat.push('new_msg', { content: message });
			};

			global_chat
				.join()
				.receive('ok', ({ messages }) => console.log('received: ' + messages))
				.receive('timeout', () => console.log('timeout'))
				.receive('error', ({ reason }) => console.log('failed to connect %s', reason));
		},
		(c) => {
			if (c) {
				c.leave();
			}
		}
	);

	let formatted_messages = derived(
		[message_store, global_presence_list],
		([message_store, global_presence_list]) =>
			message_store.map((message) => {
				const presence_info = global_presence_list?.get(message.author);
				return {
					id: message.id,
					formatted: (presence_info?.user.username ?? '???') + ': ' + message.content
				};
			})
	);

	let user_count = derived(global_presence_list, (l) => l?.size ?? 0);

	let message_input: any;

	function send_message() {
		let input: string = message_input.value;
		message_input.value = '';
		if (input.length <= 0) return;
		push_message(input);
	}

	let message_list: any;
	afterUpdate(() => {
		if (!browser) return;
		if (!message_list) return;
		message_list.scrollTop = message_list.scrollHeight;
	});
</script>

<div>
	{#if !$is_connected}
		<div id="center">
			<h4 id="top">Global Chat</h4>
			<Spinner />
		</div>
	{:else}
		<div id="top">
			<h4>Global Chat</h4>
			<h6>{$user_count} online</h6>
		</div>
		<ul id="center" bind:this={message_list}>
			{#each $formatted_messages as message (message.id)}
				<li>{message.formatted}</li>
			{/each}
		</ul>
		<form id="bottom" on:submit|preventDefault={send_message}>
			<input bind:this={message_input} type="text" placeholder="placeholder" />
			<button type="submit">Send</button>
		</form>
	{/if}
</div>

<style>
	div {
		padding: var(--size-xs);
		display: flex;
		flex-direction: column;
		gap: var(--size-m);
		height: 100%;
		width: 100%;
		max-height: 100%;
		box-sizing: border-box;
	}

	#top {
		gap: 0;
		flex-grow: 0;
		height: min-content;
		text-align: center;
		margin: var(--size-xs);
		justify-self: flex-start;
	}

	#top > * {
		margin: 0;
	}

	#center {
		padding: 0;
		margin: 0;
		list-style-type: none;
		flex-grow: 1;
		justify-self: center;
		overflow-y: scroll;
	}

	#bottom {
		flex-grow: 0;
		justify-self: flex-end;
		display: flex;
		flex-direction: row;
		gap: var(--size-s);
	}

	form > input {
		flex-grow: 1;
		justify-self: flex-start;
		background-color: var(--color-secondary);
		color: var(--color-primary);
		border: none;
		outline: var(--outline-primary);
	}

	form > button[type='submit'] {
		flex-grow: 0;
		justify-self: flex-end;
		background-color: var(--color-secondary);
		color: var(--color-primary);
		border: none;
		outline: var(--outline-primary);
	}

	form > button[type='submit']:hover {
		background-color: var(--color-primary);
		color: var(--color-secondary);
	}
</style>
