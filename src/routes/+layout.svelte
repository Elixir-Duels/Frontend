<script>
	import Chat from '$lib/Chat.svelte';
</script>

<slot />
<aside>
	<Chat />
</aside>

<style>
	aside {
		visibility: hidden;

		position: absolute;
		right: var(--size-m);
		bottom: var(--size-m);
		overflow: hidden;

		width: 25vw;
		height: 35vh;
		background-color: var(--color-secondary);
		color: var(--color-primary);
		outline: var(--outline-primary);
		box-shadow: var(--shadow-primary-xs);
		display: block;
	}

	@media only screen and (min-width: 500px) and (min-height: 300px) {
		aside {
			visibility: visible;
		}
	}
</style>
