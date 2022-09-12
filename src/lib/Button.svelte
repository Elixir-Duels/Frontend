<button on:click {...$$restProps}>
	<slot />
</button>

<style>
	button {
		display: block;
		background-color: var(--color-secondary);
		color: var(--color-primary);
		outline: var(--outline-primary);
		box-shadow: var(--shadow-primary-s);
		padding: var(--size-s);
		transition: all 0.1s ease 0s;
		text-align: center;
		text-decoration: none;
	}

	button:hover {
		transform: translate(var(--size-s), var(--size-s));
		box-shadow: none;
	}

	button:active {
		color: var(--color-secondary);
		background-color: var(--color-primary);
	}
</style>
