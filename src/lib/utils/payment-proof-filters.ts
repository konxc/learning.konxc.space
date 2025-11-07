/**
 * Utility functions for filtering payment proofs
 */

import type { PaymentProofStatus } from '$lib/constants/payment-proofs';

export interface PaymentProof {
	id: string;
	status: string;
	createdAt: Date | string;
	user: {
		fullName?: string | null;
		username?: string;
		email?: string | null;
	};
	course: {
		title: string;
		price: number;
	};
}

/**
 * Check if a payment proof matches the search query
 */
export function matchesPaymentProofSearch(proof: PaymentProof, query: string): boolean {
	if (!query) return true;
	const lowerQuery = query.toLowerCase();
	return (
		(proof.user.fullName?.toLowerCase().includes(lowerQuery) ?? false) ||
		(proof.user.username?.toLowerCase().includes(lowerQuery) ?? false) ||
		(proof.user.email?.toLowerCase().includes(lowerQuery) ?? false) ||
		proof.course.title.toLowerCase().includes(lowerQuery)
	);
}

/**
 * Check if a payment proof matches the status filter
 */
export function matchesPaymentProofStatus(
	proof: PaymentProof,
	filter: 'all' | PaymentProofStatus
): boolean {
	if (filter === 'all') return true;
	return proof.status === filter;
}

/**
 * Filter payment proofs based on search query and status filter
 */
export function filterPaymentProofs<T extends PaymentProof>(
	proofs: T[],
	searchQuery: string,
	statusFilter: 'all' | PaymentProofStatus
): T[] {
	return proofs.filter(
		(proof) =>
			matchesPaymentProofSearch(proof, searchQuery) && matchesPaymentProofStatus(proof, statusFilter)
	);
}

/**
 * Count payment proofs by status
 */
export function countPaymentProofsByStatus<T extends PaymentProof>(
	proofs: T[],
	statuses: readonly string[]
): Record<string, number> {
	const counts: Record<string, number> = {
		all: proofs.length,
		...Object.fromEntries(statuses.map((status) => [status, 0]))
	};

	proofs.forEach((proof) => {
		if (proof.status in counts) {
			counts[proof.status]++;
		}
	});

	return counts;
}

