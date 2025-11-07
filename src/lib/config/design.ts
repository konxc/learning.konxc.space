export const COLOR = {
	bg: 'bg-gray-50 dark:bg-neutral-950',
	card: 'bg-white dark:bg-neutral-900',
	cardBorder: 'border border-gray-200/60 dark:border-neutral-800',
	// WCAG AA compliant: text-gray-900 (#111827) on white has 16.56:1 contrast
	textPrimary: 'text-gray-900 dark:text-gray-50',
	// WCAG AA compliant: text-gray-700 (#374151) on white has 7.5:1 contrast (AAA for large text)
	textSecondary: 'text-gray-700 dark:text-gray-300',
	// WCAG AA compliant: text-gray-600 (#4b5563) on white has 5.74:1 contrast (AAA for large text)
	textMuted: 'text-gray-600 dark:text-gray-400',
	// WCAG AA compliant: blue-600 (#2563eb) on white has 4.81:1 contrast
	accent: 'text-blue-600 dark:text-blue-400',
	// WCAG AA compliant: blue-600 on white with white text has sufficient contrast
	accentBg: 'bg-blue-600 dark:bg-blue-500',
	accentHover: 'hover:bg-blue-700 dark:hover:bg-blue-600',
	neutral: 'bg-gray-50 dark:bg-neutral-900',
	neutralHover: 'hover:bg-gray-100 dark:hover:bg-neutral-800',
	surface: 'bg-white dark:bg-neutral-900',
	surfaceHover: 'hover:bg-gray-50 dark:hover:bg-neutral-800',
	// Status colors - WCAG AA compliant
	success: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400',
	successBg: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
	warning: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
	warningBg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
	error: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
	errorBg: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
	info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
	infoBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
	purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
	purpleBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
};

export const RADIUS = {
	card: 'rounded-2xl',
	button: 'rounded-xl',
	input: 'rounded-xl',
	badge: 'rounded-full',
	small: 'rounded-lg'
};

export const ELEVATION = {
	base: 'shadow-[0_1px_3px_0_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.3)]',
	hover:
		'hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.12),0_2px_4px_-1px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.4)]',
	transition: 'transition-shadow duration-300 ease-out',
	card: 'shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_0_rgba(0,0,0,0.3)]',
	cardHover:
		'hover:shadow-[0_8px_24px_0_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_24px_0_rgba(0,0,0,0.4)]'
};

export const SPACING = {
	page: 'px-3 md:px-4 lg:px-8 py-2',
	section: 'space-y-8 md:space-y-10',
	cardPadding: 'p-6 md:p-8',
	button: 'px-4 py-2.5',
	input: 'px-4 py-2.5',
	tight: 'space-y-4',
	relaxed: 'space-y-12'
};

export const TEXT = {
	h1: 'text-2xl md:text-3xl font-bold tracking-tight',
	h2: 'text-xl md:text-2xl font-bold tracking-tight',
	h3: 'text-lg md:text-xl font-semibold',
	h4: 'text-base font-semibold',
	// Updated for better contrast: gray-700 instead of gray-600
	secondary: 'text-sm text-gray-700 dark:text-gray-300',
	// Updated for better contrast: gray-600 instead of gray-500
	muted: 'text-xs text-gray-600 dark:text-gray-400',
	button: 'text-sm font-medium',
	body: 'text-sm leading-relaxed',
	small: 'text-xs'
};

export const TRANSITION = {
	colors: 'transition-colors duration-200 ease-out',
	all: 'transition-all duration-300 ease-out',
	shadow: 'transition-shadow duration-300 ease-out',
	transform: 'transition-transform duration-200 ease-out'
};
