/**
 * Window helper utilities
 * These functions are used for creating terminal-like prompt getters
 */

export function createPromptGetter() {
	return function getPrompt(): string {
		return '➜ ';
	};
}

export function createRightArrowGetter() {
	return function getRightArrow(): string {
		return '';
	};
}
