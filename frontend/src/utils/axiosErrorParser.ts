export interface IAxiosError<T = any> {
  isAxiosError?: boolean;
  message?: string;
  code?: string;
  response?: {
    data?: T;
    status?: number;
    statusText?: string;
  };
  [key: string]: unknown;
}

export type UnknownError = IAxiosError | Error | unknown;

export const parseAxiosError = (
  error: UnknownError,
  defaultMessage: string = "An unexpected error occurred.",
): string => {
  if (!error || typeof error !== "object") return defaultMessage;

  const err = error as IAxiosError<{ message?: string; error?: string }>;

  if (err.response?.data?.message) return String(err.response.data.message);
  if (err.response?.data?.error) return String(err.response.data.error);
  if (err.message) return String(err.message);

  return defaultMessage;
};
