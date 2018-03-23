import React from "react";

/**
 * Util class for preventing console messages on production environment.
 */
export default class Logging {
    public static log(text: string, ...args: any[]): void {
        if (!APP.ENV.DEV) {
            return;
        }

        console.info(text, ...args);
    }

    public static warn(text: string, ...args: any[]): void {
        if (!APP.ENV.DEV) {
            return;
        }

        console.warn(text, ...args);
    }

    public static error(text: string, ...args: any[]): void {
        // error messages should always be logged, regardless of environment.
        console.error(text, ...args);
    }
}
