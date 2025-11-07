export type WaitingListStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'archived';

export const WAITING_LIST_STATUSES: WaitingListStatus[] = [
	'new',
	'contacted',
	'qualified',
	'converted',
	'archived'
];

export const WAITING_LIST_STATUS_LABELS: Record<WaitingListStatus, string> = {
	new: 'New',
	contacted: 'Contacted',
	qualified: 'Qualified',
	converted: 'Converted',
	archived: 'Archived'
};
