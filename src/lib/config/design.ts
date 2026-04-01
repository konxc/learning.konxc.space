export const COLOR = {
	// Role-specific accents
	roleAdmin: {
		text: 'text-blue-600 dark:text-blue-400',
		bg: 'bg-blue-600 dark:bg-blue-500',
		bgMuted: 'bg-blue-50/50 dark:bg-blue-950/30',
		border: 'border-blue-500/50 dark:border-blue-400/50'
	},
	roleMentor: {
		text: 'text-emerald-600 dark:text-emerald-400',
		bg: 'bg-emerald-600 dark:bg-emerald-500',
		bgMuted: 'bg-emerald-50/50 dark:bg-emerald-950/30',
		border: 'border-emerald-500/50 dark:border-emerald-400/50'
	},
	roleUser: {
		text: 'text-indigo-600 dark:text-indigo-400',
		bg: 'bg-indigo-600 dark:bg-indigo-500',
		bgMuted: 'bg-indigo-50/50 dark:bg-indigo-950/30',
		border: 'border-indigo-500/50 dark:border-indigo-400/50'
	},
	roleBd: {
		text: 'text-amber-600 dark:text-amber-400',
		bg: 'bg-amber-600 dark:bg-amber-500',
		bgMuted: 'bg-amber-50/50 dark:bg-amber-950/30',
		border: 'border-amber-500/50 dark:border-amber-400/50'
	},
	bg: 'bg-zinc-50 dark:bg-zinc-950',
	card: 'bg-white/70 backdrop-blur-xl dark:bg-zinc-900/70',
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

// Status badge tokens (for StatusBadge, ConfirmDialog, tables, etc.)
export const STATUS = {
	success: {
		bg: 'bg-emerald-100 dark:bg-emerald-900/50',
		text: 'text-emerald-800 dark:text-emerald-300',
		border: 'border-emerald-200 dark:border-emerald-800/50'
	},
	warning: {
		bg: 'bg-amber-100 dark:bg-amber-900/50',
		text: 'text-amber-800 dark:text-amber-300',
		border: 'border-amber-200 dark:border-amber-800/50'
	},
	error: {
		bg: 'bg-rose-100 dark:bg-rose-900/50',
		text: 'text-rose-800 dark:text-rose-300',
		border: 'border-rose-200 dark:border-rose-800/50'
	},
	info: {
		bg: 'bg-blue-100 dark:bg-blue-900/50',
		text: 'text-blue-800 dark:text-blue-300',
		border: 'border-blue-200 dark:border-blue-800/50'
	},
	neutral: {
		bg: 'bg-gray-100 dark:bg-neutral-800',
		text: 'text-gray-600 dark:text-gray-400',
		border: 'border-gray-200 dark:border-neutral-700'
	},
	purple: {
		bg: 'bg-purple-100 dark:bg-purple-900/50',
		text: 'text-purple-800 dark:text-purple-300',
		border: 'border-purple-200 dark:border-purple-800/50'
	},
	pending: {
		bg: 'bg-yellow-100 dark:bg-yellow-900/50',
		text: 'text-yellow-800 dark:text-yellow-300',
		border: 'border-yellow-200 dark:border-yellow-800/50'
	}
} as const;

// Role badge tokens (for table badges, UI indicators)
export const ROLE_BADGE = {
	admin: {
		bg: 'bg-red-100 dark:bg-red-900/50',
		text: 'text-red-800 dark:text-red-300'
	},
	mentor: {
		bg: 'bg-blue-100 dark:bg-blue-900/50',
		text: 'text-blue-800 dark:text-blue-300'
	},
	user: {
		bg: 'bg-gray-100 dark:bg-neutral-800',
		text: 'text-gray-600 dark:text-gray-400'
	}
} as const;

// Workspace tokens (for workspace switcher)
export const WORKSPACE = {
	personal: {
		bg: 'bg-blue-600 dark:bg-blue-500',
		text: 'text-white'
	},
	organization: {
		bg: 'bg-indigo-600 dark:bg-indigo-500',
		text: 'text-white'
	}
} as const;

// Z-index layers
export const Z_INDEX = {
	dropdown: 'z-30',
	sidebar: 'z-40',
	header: 'z-50',
	modal: 'z-[100]',
	tooltip: 'z-[110]'
} as const;

// Sidebar dimensions
export const SIDEBAR = {
	collapsed: 'w-16',
	expanded: 'w-64'
} as const;

// Emulation indicator (role emulation badge)
export const EMULATION = {
	bg: 'bg-amber-100 dark:bg-amber-950/40',
	text: 'text-amber-700 dark:text-amber-400',
	ring: 'ring-amber-400/60 dark:ring-amber-500/60'
} as const;

// Badge colors (for sidebar badges, notification counts)
export const BADGE = {
	blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
	red: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
	green: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
	yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400'
} as const;

// Notification dot colors (for collapsed sidebar badges)
export const NOTIFICATION_DOT = {
	blue: 'bg-blue-500',
	red: 'bg-red-500',
	green: 'bg-green-500',
	yellow: 'bg-yellow-500'
} as const;

// Workspace dropdown item states
export const WORKSPACE_ITEM = {
	personal: {
		active: 'bg-blue-50 text-blue-700',
		icon: 'bg-blue-600 text-white',
		check: 'text-blue-600'
	},
	organization: {
		active: 'bg-indigo-50 text-indigo-700',
		icon: 'bg-indigo-600 text-white',
		check: 'text-indigo-600'
	},
	idle: 'text-gray-600 hover:bg-gray-50',
	iconIdle: 'bg-gray-200 text-gray-500'
} as const;

// Input form field tokens
export const INPUT = {
	border: 'border-zinc-300 dark:border-zinc-600',
	bg: 'bg-white dark:bg-zinc-800',
	text: 'text-zinc-900 dark:text-zinc-100',
	placeholder: 'placeholder-zinc-400 dark:placeholder-zinc-500',
	focus:
		'focus:border-blue-600 focus:ring-blue-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/50',
	hover: 'hover:border-zinc-400 dark:hover:border-zinc-500'
} as const;

// Focus ring tokens
export const FOCUS = {
	accent: 'focus-visible:ring-blue-600/70 dark:focus-visible:ring-blue-500/70',
	neutral: 'focus-visible:ring-zinc-600/70 dark:focus-visible:ring-zinc-400/70',
	error: 'focus-visible:ring-red-600/70 dark:focus-visible:ring-red-500/70',
	success: 'focus-visible:ring-green-600/70 dark:focus-visible:ring-green-500/70'
} as const;

// Table alternating row colors
export const TABLE_ALT = {
	row: 'bg-zinc-50 dark:bg-zinc-800/60'
} as const;

// Toast notification tokens
export const TOAST = {
	error: {
		border: 'border-red-200/80 dark:border-red-900/50',
		bg: 'bg-red-50/95 dark:bg-red-950/90',
		title: 'text-red-800 dark:text-red-300',
		body: 'text-red-700/90 dark:text-red-400/90'
	},
	success: {
		border: 'border-green-200/80 dark:border-green-900/50',
		bg: 'bg-green-50/95 dark:bg-green-950/90',
		title: 'text-green-800 dark:text-green-300',
		body: 'text-green-700/90 dark:text-green-400/90'
	},
	warning: {
		border: 'border-amber-200/80 dark:border-amber-900/50',
		bg: 'bg-amber-50/95 dark:bg-amber-950/90',
		title: 'text-amber-800 dark:text-amber-300',
		body: 'text-amber-700/90 dark:text-amber-400/90'
	},
	info: {
		border: 'border-blue-200/80 dark:border-blue-900/50',
		bg: 'bg-blue-50/95 dark:bg-blue-950/90',
		title: 'text-blue-800 dark:text-blue-300',
		body: 'text-blue-700/90 dark:text-blue-400/90'
	}
} as const;

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
	card: 'shadow-[0_8px_30px_rgb(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.1)]',
	cardHover:
		'hover:shadow-[0_30px_60px_rgba(0,0,0,0.08),0_12px_24px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_30px_60px_rgba(0,0,0,0.3),0_12px_24px_rgba(0,0,0,0.15)] transition-all duration-500',
	transition: 'transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)'
};

export const SHADOW = ELEVATION;

export const SPACING = {
	page: 'w-full', // Padding is consistently handled by AppShell.svelte
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

// Action button tokens (for approve/reject flows)
export const ACTION = {
	approve: 'bg-emerald-600 text-white hover:bg-emerald-700',
	reject:
		'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-400'
} as const;

// Tab tokens (for status filter tabs)
export const TAB = {
	active: 'bg-blue-600 text-white',
	inactive:
		'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
} as const;

// Table tokens (for thead, tbody divider, row hover)
export const TABLE = {
	thead: 'bg-zinc-50/70 dark:bg-zinc-800/50',
	theadBorder: 'border-zinc-100 dark:border-zinc-800',
	divider: 'divide-zinc-50 dark:divide-zinc-800/60',
	rowHover: 'hover:bg-blue-50/20 dark:hover:bg-blue-950/10',
	accentText: 'text-blue-600 dark:text-blue-400',
	accentTextGreen: 'text-green-600 dark:text-green-400',
	accentTextAmber: 'text-amber-600 dark:text-amber-400'
} as const;

// Modal overlay tokens
export const MODAL = {
	overlay: 'bg-black/50 dark:bg-black/70',
	panel: 'bg-white shadow-xl dark:bg-zinc-900 dark:shadow-2xl'
} as const;

export const TRANSITION = {
	colors: 'transition-colors duration-200 ease-out',
	all: 'transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)',
	shadow: 'transition-shadow duration-300 ease-out',
	transform: 'transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)',
	spring: 'transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)'
};
