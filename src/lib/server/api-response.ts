/**
 * API Response Utilities
 * Provides consistent response format across all API endpoints
 */

import { json } from '@sveltejs/kit';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
	success: true;
	data?: T;
	message?: string;
}

export interface ApiErrorResponse {
	success: false;
	error: string;
	code?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Success Responses ─────────────────────────────────────────────────────────

export function apiSuccess<T>(data?: T, message?: string, status = 200) {
	return json({ success: true, data, message }, { status });
}

export function apiCreated<T>(data: T, message = 'Created') {
	return json({ success: true, data, message }, { status: 201 });
}

export function apiNoContent() {
	return new Response(null, { status: 204 });
}

// ─── Error Responses ───────────────────────────────────────────────────────────

export function apiError(error: string, status = 400, code?: string) {
	return json({ success: false, error, code }, { status });
}

export function apiUnauthorized(message = 'Unauthorized') {
	return apiError(message, 401, 'UNAUTHORIZED');
}

export function apiForbidden(message = 'Forbidden') {
	return apiError(message, 403, 'FORBIDDEN');
}

export function apiNotFound(message = 'Not found') {
	return apiError(message, 404, 'NOT_FOUND');
}

export function apiConflict(message = 'Conflict') {
	return apiError(message, 409, 'CONFLICT');
}

export function apiValidationError(
	message = 'Validation failed',
	errors?: Record<string, string[]>
) {
	return json(
		{
			success: false,
			error: message,
			code: 'VALIDATION_ERROR',
			errors
		},
		{ status: 422 }
	);
}

export function apiServerError(message = 'Internal server error') {
	return apiError(message, 500, 'INTERNAL_ERROR');
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Safe async wrapper that catches errors and returns API error response
 */
export function apiHandler<T>(fn: () => Promise<T>, errorMessage = 'Request failed') {
	return async () => {
		try {
			const data = await fn();
			return apiSuccess(data);
		} catch (error) {
			console.error(error);
			return apiServerError(errorMessage);
		}
	};
}

/**
 * Validate required fields in request body
 */
export function validateRequired(body: Record<string, unknown>, fields: string[]): string | null {
	for (const field of fields) {
		if (body[field] === undefined || body[field] === null || body[field] === '') {
			return `Missing required field: ${field}`;
		}
	}
	return null;
}
