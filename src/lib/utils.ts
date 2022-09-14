import { writable, type Readable } from 'svelte/store';
import { browser as app_browser } from '$app/environment';

const _browser = writable(app_browser);
export const browser: Readable<boolean> = _browser;

_browser.set(app_browser);

export const api = 'api.duels.kaij.tech:4000';
