export interface ValidationError {
    [key: string]: string[] | undefined;
}

export type ErrorType = ValidationError | string | undefined;

export interface ErrorState {
    error: ErrorType;
    message?: string;
}

export interface ReviewErrorState extends ErrorState {
    error: ErrorType;
    message: string;
}