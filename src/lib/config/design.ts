export const COLOR = {
	bg: 'bg-zinc-50 dark:bg-zinc-950',
	card: 'bg-white/80 backdrop-blur-md dark:bg-zinc-900/80',
	cardBorder: 'border border-zinc-200/50 dark:border-zinc-800/50',
	// High-contrast neutrals
	textPrimary: 'text-zinc-900 dark:text-zinc-50',
	textSecondary: 'text-zinc-600 dark:text-zinc-400',
	textMuted: 'text-zinc-400 dark:text-zinc-500',
	// Brand Accents (Vibrant Blue)
	accent: 'text-blue-600 dark:text-blue-400',
	accentBg: 'bg-blue-600 dark:bg-blue-500',
	accentHover: 'hover:bg-blue-700 dark:hover:bg-blue-600',
	// Neutral Surface
	neutral: 'bg-zinc-100 dark:bg-zinc-900',
	neutralHover: 'hover:bg-zinc-200 dark:hover:bg-zinc-800',
	surface: 'bg-white dark:bg-zinc-900',
	surfaceHover: 'hover:bg-zinc-50 dark:hover:bg-zinc-800',
	// Status (Slightly more vibrant for SaaS feel)
	success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
	successBg: 'bg-emerald-500 text-white',
	warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
	warningBg: 'bg-amber-500 text-white',
	error: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400',
	errorBg: 'bg-rose-500 text-white',
	info: 'bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400'
};

export const GRADIENT = {
	primary: 'bg-gradient-to-br from-blue-600 to-indigo-700',
	surface: 'bg-gradient-to-b from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-950/50',
	glow: 'after:absolute after:inset-0 after:z-[-1] after:bg-blue-500/10 after:blur-2xl after:opacity-0 hover:after:opacity-100'
};

export const RADIUS = {
	card: 'rounded-[1.25rem]',
	button: 'rounded-xl',
	input: 'rounded-xl',
	badge: 'rounded-full',
	small: 'rounded-lg'
};

export const ELEVATION = {
	base: 'shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_-1px_rgba(0,0,0,0.03)] dark:shadow-none',
	card: 'shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]',
	cardHover: 'hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500',
	transition: 'transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)'
};

export const SHADOW = ELEVATION;

export const SPACING = {
	page: 'px-6 md:px-12 lg:px-16 py-8',
	section: 'space-y-10 md:space-y-16',
	cardPadding: 'p-8',
	button: 'px-5 py-2.5',
	input: 'px-4 py-2.5',
	tight: 'space-y-4',
	relaxed: 'space-y-16'
};

export const TEXT = {
	h1: 'text-3xl md:text-4xl font-bold tracking-[-0.03em]',
	h2: 'text-2xl md:text-3xl font-bold tracking-[-0.02em]',
	h3: 'text-xl md:text-2xl font-semibold tracking-[-0.01em]',
	h4: 'text-lg font-semibold',
	secondary: 'text-[0.9375rem] leading-relaxed text-zinc-600 dark:text-zinc-400',
	muted: 'text-sm text-zinc-400 dark:text-zinc-500 font-medium',
	button: 'text-sm font-semibold tracking-tight',
	body: 'text-[15px] leading-relaxed',
	small: 'text-[11px] font-bold uppercase tracking-widest'
};

export const TRANSITION = {
	colors: 'transition-colors duration-200 ease-out',
	all: 'transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)',
	shadow: 'transition-shadow duration-300 ease-out',
	transform: 'transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)'
};
