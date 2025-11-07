// Helper format tanggal, angka, dan mata uang

export function formatDate(date: Date | string, locale = 'id-ID') {
	const d = typeof date === 'string' ? new Date(date) : date;
	return new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'short',
		day: '2-digit'
	}).format(d);
}

export function formatDateTime(date: Date | string | number, locale = 'id-ID') {
	const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
	return new Intl.DateTimeFormat(locale, {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(d);
}

export function formatNumber(value: number, locale = 'id-ID') {
	return new Intl.NumberFormat(locale).format(value);
}

export function formatCurrency(value: number, currency = 'IDR', locale = 'id-ID') {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		maximumFractionDigits: 0
	}).format(value);
}
