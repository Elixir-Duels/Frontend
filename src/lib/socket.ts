import { browser } from '$app/environment';
import { Socket } from 'phoenix';
import { writable, type Writable } from 'svelte/store';

export const socket: Writable<Socket | undefined> = writable(undefined);
export const is_connected = writable(false);
socket.subscribe((socket: Socket | undefined) => socket?.onOpen(() => update_connected(socket)));
socket.subscribe((socket: Socket | undefined) => socket?.onClose(() => update_connected(socket)));
socket.subscribe((socket: Socket | undefined) => socket?.onError(() => update_connected(socket)));

const update_connected = (socket: Socket | undefined) =>
	is_connected.set((socket && socket.connectionState() == 'open') ?? false);

function create_socket(): Socket {
	// todo: provide token in params
	const socket = new Socket('ws://127.0.0.1:4000/socket', { params: {} });
	socket.connect();
	return socket;
}

if (browser) {
	socket.set(create_socket());
}
