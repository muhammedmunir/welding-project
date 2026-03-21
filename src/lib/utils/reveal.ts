import type { Action } from 'svelte/action';

interface RevealOptions {
	threshold?: number;
	delay?: number;
}

/**
 * Svelte action: fade + slide-up when element enters viewport.
 * Usage: <div use:reveal> atau <div use:reveal={{ delay: 150 }}>
 */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options) => {
	const { threshold = 0.1, delay = 0 } = options ?? {};

	node.classList.add('reveal-init');
	if (delay) node.style.transitionDelay = `${delay}ms`;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.classList.add('reveal-visible');
				observer.unobserve(node);
			}
		},
		{ threshold }
	);

	observer.observe(node);

	return { destroy: () => observer.disconnect() };
};
