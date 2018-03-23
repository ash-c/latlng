import Axios from "axios";
import React from "react";

import { ajax as Config } from "configs/debug";
import Logging from "utils/logging";
import Mock from "utils/mock";

/**
 * Utility class for handling ajax requests.
 */
export default class Ajax {
    /**
     * Static function for sending POST requests.
     * @param path Path to POST data to.
     * @param data Data to send.
     * @returns {Promise} Returns a promise.
     */
    public static post(path: string, data: any): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            Ajax.log("Sending POST: %s, data: %o", path, data);
            if (Config.dev) {
                setTimeout(() => {
                    Mock.post(path)
                        .then((result: JsonResult) => {
                            Ajax.log("Completed DEV POST: %s, response: %o", path, result);
                            resolve(result);
                        })
                        .catch((error: Error) => {
                            Logging.error("Completed DEV POST: %s, %o", path, error);
                            reject(error);
                        });
                }, Config.timeout);
            } else {
                Axios.post(path, data)
                    .then((result: JsonResult) => {
                        Ajax.log("Completed POST: %s, response: %o", path, result);
                        resolve(result);
                    }).catch((error: Error) => {
                        Logging.error("Completed POST: %s, %o", path, error);
                        reject(error);
                    });
            }
        });
    }

    /**
     * Static function for sending GET requests.
     * @param path Path to send GET request to.
     * @returns {Promise} Returns a Promise.
     */
    public static get(path: string, data?: any): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            Ajax.log("Sending GET: %s", path);
            if (Config.dev) {
                setTimeout(() => {
                    Mock.get(path)
                        .then((result: JsonResult) => {
                            Ajax.log("Completed DEV GET: %s, response: %o", path, result);
                            resolve(result);
                        })
                        .catch((error: Error) => {
                            Logging.error("Completed DEV GET: %s, %o", path, error);
                            reject(error);
                        });
                }, Config.timeout);
            } else {
                Axios.get(path)
                    .then((result: JsonResult) => {
                        Ajax.log("Completed GET: %s, response: %o", path, result);
                        resolve(result);
                    })
                    .catch((error: Error) => {
                        Logging.error("Completed GET: %s, %o", path, error);
                        reject(error);
                    });
            }
        });
    }

    /**
     * Internal function for logging. Allows easy enable/disable of all standard logging.
     * @param message Message to log.
     * @param args Arguments to include in the message.
     */
    protected static log(message: string, ...args: any[]) {
        if (Config.log) {
            Logging.log(message, ...args);
        }
    }
}
