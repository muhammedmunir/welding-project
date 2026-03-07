<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let { targetDate, theme = 'fairy' }: { targetDate: string; theme?: 'fairy' | 'malay' } = $props();

	let days = $state(0);
	let hours = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);
	let expired = $state(false);
	let interval: ReturnType<typeof setInterval>;

	function tick() {
		const target = new Date(targetDate + 'T00:00:00').getTime();
		const now = Date.now();
		const diff = target - now;

		if (diff <= 0) {
			expired = true;
			days = hours = minutes = seconds = 0;
			clearInterval(interval);
			return;
		}

		days = Math.floor(diff / (1000 * 60 * 60 * 24));
		hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((diff % (1000 * 60)) / 1000);
	}

	onMount(() => {
		tick();
		interval = setInterval(tick, 1000);
	});

	onDestroy(() => clearInterval(interval));

	const isFairy = $derived(theme === 'fairy');
</script>

<div class="countdown-wrap" role="timer" aria-label="Masa berbaki sebelum majlis">
	{#if expired}
		<p class="expired-msg">Alhamdulillah, majlis telah bermula!</p>
	{:else}
		<div class="countdown-grid">
			{#each [
				{ value: days, label: 'Hari' },
				{ value: hours, label: 'Jam' },
				{ value: minutes, label: 'Minit' },
				{ value: seconds, label: 'Saat' }
			] as unit}
				<div class="unit" class:fairy={isFairy} class:malay={!isFairy}>
					<span class="number">{String(unit.value).padStart(2, '0')}</span>
					<span class="label">{unit.label}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.countdown-wrap {
		display: flex;
		justify-content: center;
		padding: 1rem 0;
	}

	.expired-msg {
		font-family: var(--font-playfair);
		font-size: 1.25rem;
		text-align: center;
	}

	.countdown-grid {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.unit {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 70px;
		padding: 0.75rem 1rem;
		border-radius: 12px;
		text-align: center;
	}

	.unit.fairy {
		background: rgba(192, 132, 190, 0.15);
		border: 2px solid rgba(192, 132, 190, 0.4);
	}

	.unit.malay {
		background: rgba(201, 162, 39, 0.12);
		border: 2px solid rgba(201, 162, 39, 0.4);
	}

	.number {
		font-family: var(--font-playfair);
		font-size: clamp(1.75rem, 5vw, 2.5rem);
		font-weight: 700;
		line-height: 1;
	}

	.fairy .number {
		color: var(--color-fairy-primary);
	}

	.malay .number {
		color: var(--color-malay-primary);
	}

	.label {
		font-family: var(--font-lato);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-top: 0.3rem;
	}

	.fairy .label {
		color: var(--color-fairy-muted);
	}

	.malay .label {
		color: var(--color-malay-muted);
	}
</style>
