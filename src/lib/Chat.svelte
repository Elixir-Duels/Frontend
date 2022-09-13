<script lang="ts">
	import { socket } from '$lib/socket';
	import { derived, writable, type Writable } from 'svelte/store';
	import type { Socket, Channel } from 'phoenix';
	import { browser } from '$app/environment';
	import { afterUpdate } from 'svelte';

	type Message = { id: string; author: string; content: string };

	let push_message: (message: string) => void;

	let global_chat = derived(socket, (socket: Socket | undefined) => socket?.channel('chat:global'));
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
				.receive('ok', ({ messages }) => console.log(messages))
				.receive('timeout', () => console.log('timeout'))
				.receive('error', ({ reason }) => console.log('failed to connect %s', reason));
		},
		(c) => {
			if (c) {
				c.leave();
			}
		}
	);

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
	<h4>Global Chat</h4>
	<ul bind:this={message_list}>
		{#each $message_store as message (message.id)}
			<li>{message.author}: {message.content}</li>
		{/each}
	</ul>
	<form on:submit|preventDefault={send_message}>
		<input bind:this={message_input} type="text" />
		<button type="submit">Send</button>
	</form>
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

	h4 {
		flex-grow: 0;
		text-align: center;
		margin: var(--size-xs);
		justify-self: flex-start;
	}

	ul {
		padding: 0;
		margin: 0;
		list-style-type: none;
		flex-grow: 1;
		justify-self: center;
		overflow-y: scroll;
	}

	form {
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
