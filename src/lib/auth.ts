import { derived, writable, type Readable, type Writable } from 'svelte/store';
import { api } from './utils';

type UserInfo = { username: string; token: string; id: string };

const user_info: Writable<UserInfo | undefined> = writable(undefined);
export const username: Readable<string | undefined> = derived(
	user_info,
	(user_info) => user_info?.username
);
export const token: Readable<string | undefined> = derived(
	user_info,
	(user_info) => user_info?.token
);
export const logged_in: Readable<boolean> = derived(user_info, (user_info) => !!user_info);

export const signup = (username: string, password: string) => {
	const req = new Request('https://' + api + '/users/signup', {
		body: JSON.stringify({
			user: {
				username,
				password
			}
		}),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		method: 'POST'
	});
	fetch(req)
		.then((response) => {
			if (!response.ok) {
				console.error('failed to signup');
				return;
			}
			return response.json();
		})
		.then((x) => {
			if (!x) return;
			user_info.set({ username: x.username, token: x.token, id: x.id });
		});
};

export const login = (username: string, password: string) => {
	const req = new Request('https://' + api + '/users/signin', {
		body: JSON.stringify({
			username,
			password
		}),
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});
	fetch(req)
		.then((response) => {
			if (!response.ok) {
				console.error('failed to signin');
				return;
			}
			return response.json();
		})
		.then((x) => {
			if (!x) return;
			user_info.set({ username: x.username, token: x.token, id: x.id });
		});
};
