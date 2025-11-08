import { fail } from '@sveltejs/kit';
import type {
	FormActionFailure,
	FormActionResult,
	FormActionSuccess
} from '$lib/types/actions';

type SuccessConfig<T> = {
	message?: string;
	data?: T;
};

type FailureConfig<FieldErrors, T> = {
	message?: string;
	fieldErrors?: FieldErrors;
	data?: T;
};

export function actionSuccess<T = undefined>(
	config: SuccessConfig<T> = {}
): FormActionSuccess<T> {
	return {
		success: true,
		...config
	};
}

export function actionFailure<FieldErrors = Record<string, string> | undefined, T = undefined>(
	status: number,
	errorMessage: string,
	config: FailureConfig<FieldErrors, T> = {}
): FormActionResult<T, FieldErrors> {
	return fail(status, {
		success: false,
		error: errorMessage,
		message: config.message ?? errorMessage,
		fieldErrors: config.fieldErrors,
		data: config.data
	}) as never;
}

