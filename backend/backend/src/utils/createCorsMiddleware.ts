/* eslint-disable no-unused-vars */
// corsHelper.ts
import { CorsOptions } from 'cors';

/**
 * Generates CORS options object
 * @param allowedOriginsEnv - JSON string array of allowed origins
 */
export function getCorsOptions(allowedOriginsEnv?: string): CorsOptions {
  const allowedOrigins: string[] = allowedOriginsEnv
    ? JSON.parse(allowedOriginsEnv)
    : [];

  return {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return callback(null, true); // allow non-browser requests

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy does not allow access from ${origin}`));
      }
    },
    credentials: true,
  };
}
