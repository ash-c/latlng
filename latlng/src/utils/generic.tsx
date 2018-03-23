import React from "react";

import { utils as Config } from "configs/debug";
import Logging from "utils/logging";

/**
 * General utility class.
 */
export default class U {

    public static ConfigKey(key: string, gender: string): string {
        if (-1 < key.indexOf("Men's")) {
            key = "HormonalM";
        } else if (-1 < key.indexOf("Women's")) {
            key = "HormonalF";
        } else if (-1 < key.indexOf("Digestive")) {
            key = "Digestive";
        } else if (-1 < key.indexOf("Joint")) {
            key = "Joints";
        } else if (-1 < key.indexOf("Heart") || -1 < key.indexOf("Cardio")) {
            key = "Cardio";
        } else if (-1 < key.indexOf("Brain") || -1 < key.indexOf("Neuro")) {
            key = "Neuro";
        } else if (-1 < key.indexOf("General")) {
            key = "General";
        }
        return key;
    }

    /**
     * Get an HTMLElement.
     * @param id The id of the element to retrieve.
     * @returns {HTMLElement} Returns an HTMLElement or null if it doesn't exist.
     */
    public static ById(id: string): HTMLElement | null {

        const obj = document.getElementById(id);

        if (Config.log) {
            Logging.log("Utils.ById: Looking for #%s", id);
            if (null !== obj) {
                Logging.log("Utils.ById: Found #%s: %o", id, obj);
            }
        }

        if (null === obj) {
            Logging.error("Utils.ById: Did not find #%s!", id);
        }

        return obj;
    }

    /**
     * Map an object out based on its keys.
     * @param object The object to map out.
     * @param callback A callback that manipulates the given key value, and returns something, usually a JSXElement.
     * @returns {any[]} Returns an array of elements created by the callback.
     */
    public static MapObject(object: any, callback: any): any[] {
        return Object.keys(object).map((key: any) => {
            return callback(key, object[key]);
        });
    }

    /**
     * Sets a cookie with an expire time of 24 hours, using the docCookies javascript library.
     * @param name The name of the cookie.
     * @param value The value of the cookie.
     * @returns {void}
     */
    public static Set24HourCookie(name: string, value: string): void {
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);
        docCookies.setItem(name, value, expireDate);
    }
}
