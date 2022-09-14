import { Socket } from 'phoenix';
import { derived, writable, type Readable } from 'svelte/store';
import { token } from './auth';
import { api, browser } from './utils';

export const socket: Readable<Socket | undefined> = derived(
	[token, browser],
	([token, browser]) => {
		if (!token) return undefined;
		if (!browser) return undefined;
		console.log('recreating socket with token ' + token);
		const socket = new Socket('wss://' + api + '/socket', { params: { token } });
		socket.connect();
		return socket;
	}
);

export const is_connected = writable(false);

const update_connected = (socket: Socket | undefined) =>
	is_connected.set((socket && socket.connectionState() == 'open') ?? false);

socket.subscribe((socket: Socket | undefined) => socket?.onOpen(() => update_connected(socket)));
socket.subscribe((socket: Socket | undefined) => socket?.onClose(() => update_connected(socket)));
socket.subscribe((socket: Socket | undefined) => socket?.onError(() => update_connected(socket)));
