/**
 * AboutWindow Helper Functions
 * 
 * Wrapper functions untuk AboutWindow props
 */

import { getPrompt, getRightArrow, type TerminalTheme } from './terminalTheme';

/**
 * Create prompt getter function for AboutWindow
 */
export function createPromptGetter() {
	return (t: string) => getPrompt(t as TerminalTheme);
}

/**
 * Create right arrow getter function for AboutWindow
 */
export function createRightArrowGetter() {
	return (t: string) => getRightArrow(t as TerminalTheme);
}

