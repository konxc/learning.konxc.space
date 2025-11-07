/**
 * Shared Types untuk Timeline Components
 */

export interface TimelineItemData {
	title: string;
	subtitle?: string;
	description: string[];
}

export interface TimelineCardProps extends TimelineItemData {
	alignment?: 'left' | 'right';
	cardId?: string;
}

export interface TimelineItemProps extends TimelineItemData {
	index?: number;
}

/**
 * Constants untuk Timeline
 */
export const TIMELINE_CONSTANTS = {
	/** Index maksimal untuk menggunakan TimelineCard (index < TIMELINE_CARD_MAX_INDEX) */
	TIMELINE_CARD_MAX_INDEX: 4,
	/** Animation delay per item (ms) */
	ANIMATION_DELAY_PER_ITEM: 100,
	/** Animation duration (ms) */
	ANIMATION_DURATION: 600,
	/** Animation y offset (px) */
	ANIMATION_Y_OFFSET: 30,
	/** Intersection Observer threshold */
	OBSERVER_THRESHOLD: 0.15,
	/** Intersection Observer root margin */
	OBSERVER_ROOT_MARGIN: '0px 0px -80px 0px',
	/** Timeout untuk observer setup (ms) */
	OBSERVER_SETUP_TIMEOUT: 100
} as const;

