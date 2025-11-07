/**
 * Shared type definitions for table components
 */

export interface TableColumn {
	key: string;
	label: string;
	required?: boolean;
	width?: string;
	align?: 'left' | 'center' | 'right';
}

