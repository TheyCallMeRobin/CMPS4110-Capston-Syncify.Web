/* eslint-disable no-restricted-syntax */

// src/utils/logger.ts

// Define log levels for better categorization of logs
const isProduction = process.env.NODE_ENV === 'production';

// Logger function for informational messages
export const logInfo = (...args: unknown[]) => {
    if (!isProduction) {
        console.info('[INFO]:', ...args);
    }
};

// Logger function for warnings
export const logWarn = (...args: unknown[]) => {
    if (!isProduction) {
        console.warn('[WARN]:', ...args);
    }
};

// Logger function for errors
export const logError = (...args: unknown[]) => {
    if (!isProduction) {
        console.error('[ERROR]:', ...args);
    }
    // In production, you could send this error to a remote logging service
    // Example: sendErrorToService(...args);
};
