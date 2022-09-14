<div class="lds-ripple">
	<div />
	<div />
</div>

<style>
	.lds-ripple {
		aspect-ratio: 1/1;
		display: inline-block;
		position: relative;
		max-width: 100%;
		max-height: 100%;
		min-height: 80px;
		min-width: 80px;
	}
	.lds-ripple div {
		position: absolute;
		border: var(--size-s) solid var(--color-primary);
		opacity: 1;
		border-radius: 50%;
		animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
	}
	.lds-ripple div:nth-child(2) {
		animation-delay: -0.5s;
	}
	@keyframes lds-ripple {
		0% {
			top: 45%;
			left: 45%;
			width: 0;
			height: 0;
			opacity: 0;
		}
		4.9% {
			top: 45%;
			left: 45%;
			width: 0;
			height: 0;
			opacity: 0;
		}
		5% {
			top: 45%;
			left: 45%;
			width: 0;
			height: 0;
			opacity: 1;
		}
		100% {
			top: 0px;
			left: 0px;
			width: 90%;
			height: 90%;
			opacity: 0;
		}
	}
</style>
