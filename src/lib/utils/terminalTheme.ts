/**
 * Terminal Theme Utilities
 * 
 * Shared utilities untuk terminal theme configuration
 */

export type TerminalTheme = 'default' | 'robbyrussell' | 'agnoster' | 'p10k';

export const TERMINAL_CONFIG = {
	directory: ' ~/Projects/naik-kelas',
	gitBranch: ' [main]'
} as const;

export function getThemeColor(theme: TerminalTheme): string {
	switch (theme) {
		case 'p10k':
			return '#7ee787';
		case 'agnoster':
			return '#8be9fd';
		case 'robbyrussell':
			return '#f1fa8c';
		default:
			return '#4ade80';
	}
}

export function getPrompt(theme: TerminalTheme): string {
	switch (theme) {
		case 'p10k':
			return '❯ ';
		case 'agnoster':
		case 'robbyrussell':
		default:
			return '➜ ';
	}
}

export function getRightArrow(theme: TerminalTheme): string {
	switch (theme) {
		case 'p10k':
			return ' ❯';
		case 'agnoster':
		case 'robbyrussell':
		default:
			return '';
	}
}

export function getFullPrompt(theme: TerminalTheme): string {
	return `${getPrompt(theme)}${TERMINAL_CONFIG.directory}${TERMINAL_CONFIG.gitBranch}${getRightArrow(theme)} `;
}

