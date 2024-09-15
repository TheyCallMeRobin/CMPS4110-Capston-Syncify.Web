export interface Response<T> {
	data: T | null;
	hasErrors: boolean;
	errors: Error[];
}

export interface Error {
	propertyName: string;
	errorMessage: string;
}