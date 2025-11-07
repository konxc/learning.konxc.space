import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const PAGE_METADATA_KEY = Symbol('page-metadata');

export interface PageMetadata {
	title: string;
	description?: string;
}

/**
 * Context store untuk page metadata (title & description)
 * Digunakan untuk menyimpan metadata halaman yang akan ditampilkan di header
 */
export function createPageMetadata() {
	const metadata = writable<PageMetadata>({ title: '', description: undefined });
	setContext(PAGE_METADATA_KEY, metadata);
	return metadata;
}

export function getPageMetadata(): Writable<PageMetadata> {
	return getContext<Writable<PageMetadata>>(PAGE_METADATA_KEY);
}

/**
 * Helper function untuk set page metadata
 */
export function setPageMetadata(title: string, description?: string) {
	const metadata = getPageMetadata();
	metadata.set({ title, description });
}
