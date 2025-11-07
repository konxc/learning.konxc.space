/**
 * Constants for Payment Proof Management
 */

export const PAYMENT_PROOF_STATUSES = ['pending', 'approved', 'rejected'] as const;

export type PaymentProofStatus = (typeof PAYMENT_PROOF_STATUSES)[number];

export const PAYMENT_PROOF_STATUS_LABELS: Record<PaymentProofStatus, string> = {
	pending: 'Pending',
	approved: 'Approved',
	rejected: 'Rejected'
};

