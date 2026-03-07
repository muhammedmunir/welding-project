<script lang="ts">
	let {
		theme = 'fairy',
		sections = [] as { id: string; label: string; icon: string }[]
	} = $props();

	let visible = $state(false);
	let activeId = $state('');

	function onScroll() {
		visible = window.scrollY > 80;

		// Determine active section
		for (const s of [...sections].reverse()) {
			const el = document.getElementById(s.id);
			if (el && window.scrollY >= el.offsetTop - 120) {
				activeId = s.id;
				break;
			}
		}
	}

	function scrollTo(id: string) {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	import { onMount } from 'svelte';
	onMount(() => {
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<nav
	class="sticky-nav"
	class:visible
	class:fairy={theme === 'fairy'}
	class:malay={theme === 'malay'}
	aria-label="Navigasi pantas"
>
	<ul>
		{#each sections as s}
			<li>
				<button
					onclick={() => scrollTo(s.id)}
					class:active={activeId === s.id}
					aria-label="Pergi ke {s.label}"
				>
					<span class="nav-icon" aria-hidden="true">{s.icon}</span>
					<span class="nav-label">{s.label}</span>
				</button>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.sticky-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 40;
		background: rgba(255, 255, 255, 0.97);
		backdrop-filter: blur(14px);
		border-top: 1px solid rgba(0, 0, 0, 0.07);
		transform: translateY(100%);
		transition: transform 0.3s ease;
		box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.07);
		padding-bottom: env(safe-area-inset-bottom, 0px);
	}

	.sticky-nav.visible {
		transform: translateY(0);
	}

	ul {
		display: flex;
		align-items: stretch;
		justify-content: space-around;
		list-style: none;
		margin: 0;
		padding: 0;
		overflow-x: auto;
		scrollbar-width: none;
	}

	ul::-webkit-scrollbar { display: none; }

	li { flex: 1; }

	button {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 0.55rem 0.5rem;
		background: none;
		border: none;
		cursor: pointer;
		color: #aaa;
		transition: color 0.2s;
		border-top: 2px solid transparent;
		white-space: nowrap;
	}

	button:hover {
		color: #666;
	}

	.fairy button.active {
		color: #b87fa8;
		border-top-color: #b87fa8;
	}

	.malay button.active {
		color: #c9a227;
		border-top-color: #c9a227;
	}

	.nav-icon {
		font-size: 1rem;
		line-height: 1;
	}

	.nav-label {
		font-family: var(--font-lato);
		font-size: 0.58rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-weight: 600;
	}
</style>
