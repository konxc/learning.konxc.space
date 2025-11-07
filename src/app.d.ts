// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
		// interface Error {}
		// interface PageData {}
		// interface Platform {}
	}
	interface Window {
		gtag?: (...args: unknown[]) => void;
	}
}

declare module 'svelte-toast' {
	interface ToastOptions {
		position?: string;
		duration?: number;
	}

	export default class Toast {
		constructor(options?: ToastOptions);
		success(message: string): void;
		info(message: string): void;
		error(message: string): void;
		warning(message: string): void;
		dismiss(): void;
	}
}

export {};
