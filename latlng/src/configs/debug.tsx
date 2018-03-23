
/**
 * Config settings for generic utility functions.
 */
export const utils = {
    // Should log all messages.
    log: (APP.ENV.DEV) && true,
};

/**
 * Config settings for the pre-loader.
 */
export const loader = {
    // Should log all messages.
    log: (APP.ENV.DEV) && true,
};

/**
 * Config settings for utils/ajax.
 */
export const ajax = {
    // Should log all messages.
    log: (APP.ENV.DEV) && true,
    // Should be in dev mode, and mock requests rather than sending them to the server.
    dev: (APP.ENV.DEV) && false,
    // Timeout period for requests for dev mode.
    timeout: 2500,
};

/**
 * Config settings for utils/mock.
 */
export const mock = {
    // Should log all messages.
    log: (APP.ENV.DEV) && true,
    // Should fail.
    error: false,
};

/**
 * Config settings for forms.
 */
export const form = {
    // Should log all messages.
    log: (APP.ENV.DEV) && true,
    // Should stop on field validation error. Set to false to submit form even with validation errors.
    // TESTING ONLY.
    stopOnError: true,
};
