import { derived, writable, type Readable, type Writable } from 'svelte/store';
import { api } from './utils';

type UserInfo = { username: string; token: string; id: string };

const user_info: Writable<UserInfo | undefined> = writable(undefined);
user_info.subscribe((user_info) => {
	if (user_info) {
		localStorage.setItem('user_info', JSON.stringify(user_info));
	}
});

export const username: Readable<string | undefined> = derived(
	user_info,
	(user_info) => user_info?.username
);

export const token: Readable<string | undefined> = derived(
	user_info,
	(user_info) => user_info?.token
);
export const logged_in: Readable<boolean> = derived(user_info, (user_info) => {
	return !!user_info;
});

token.subscribe((token) => {
	if (!token) return;
	const req = new Request('https://' + api + '/users/me', {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token
		},
		method: 'GET'
	});
	fetch(req)
		.catch(() => {
			/* downstream will handle this automatically */
			return undefined;
		})
		.then(async (r) => {
			if (r?.ok) {
				return await r.json();
			} else {
				return undefined;
			}
		})
		.then((info: any) => {
			if (info && info.username && info.id && info.token) {
				// yey
			} else {
				user_info.set(undefined);
			}
		});
});

const stored_user_info_string = localStorage.getItem('user_info');
if (
	stored_user_info_string != null &&
	stored_user_info_string != undefined &&
	stored_user_info_string.length > 4
) {
	try {
		const stored_user_info = JSON.parse(stored_user_info_string);
		if (
			stored_user_info &&
			stored_user_info.username &&
			stored_user_info.id &&
			stored_user_info.token
		) {
			console.log('loaded from storage');
			user_info.set(stored_user_info);
		}
	} catch {
		/* don't care */
	}
}

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
				location.reload();
				return;
			}
			return response.json();
		})
		.then((x) => {
			if (!x) return;
			user_info.set({ username: x.username, token: x.token, id: x.id });
		});
};
