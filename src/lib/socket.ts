import { Socket } from 'phoenix';
import { derived, writable, type Readable } from 'svelte/store';
import { token } from './auth';
import { api } from './utils';

export const socket: Readable<Socket | undefined> = derived(token, (token) => {
	if (!token) return undefined;
	const socket = new Socket('wss://' + api + '/socket', { params: { token } });
	socket.connect();
	return socket;
});

export const is_connected = writable(false);

const update_connected = (socket: Socket | undefined) => {
	const state = socket?.connectionState();
	is_connected.set(state == 'open' ?? false);
};

socket.subscribe((socket: Socket | undefined) => socket?.onOpen(() => update_connected(socket)));
socket.subscribe((socket: Socket | undefined) => socket?.onClose(() => update_connected(socket)));
socket.subscribe((socket: Socket | undefined) => socket?.onError(() => update_connected(socket)));
