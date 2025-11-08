export type FormActionSuccess<T = undefined> = {
    success: true;
    message?: string;
    data?: T;
};

export type FormActionFailure<FieldErrors = Record<string, string> | undefined, T = undefined> = {
    success: false;
    error: string;
    message?: string;
    fieldErrors?: FieldErrors;
    data?: T;
};

export type FormActionResult<T = undefined, FieldErrors = Record<string, string> | undefined> =
    | FormActionSuccess<T>
    | FormActionFailure<FieldErrors, T>;

