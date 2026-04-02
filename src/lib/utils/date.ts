/**
 * Shared date formatting utilities
 * Provides consistent date formatting across the app
 */

export function formatRelativeTime(date: string | Date | null | undefined): string {
	if (!date) return '';

	const now = new Date();
	const notifDate = new Date(date);
	const diffMs = now.getTime() - notifDate.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffMins < 1) return 'Baru saja';
	if (diffMins < 60) return `${diffMins} menit lalu`;
	if (diffHours < 24) return `${diffHours} jam lalu`;
	if (diffDays < 7) return `${diffDays} hari lalu`;

	return notifDate.toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'short'
	});
}

export function formatDateTime(date: string | Date | null | undefined): string {
	if (!date) return '';

	return new Date(date).toLocaleString('id-ID', {
		day: 'numeric',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function formatDate(date: string | Date | null | undefined): string {
	if (!date) return '';

	return new Date(date).toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
}

export function formatFullDate(date: string | Date | null | undefined): string {
	if (!date) return '';

	return new Date(date).toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
}
