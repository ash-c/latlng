import { mock as Config } from "configs/debug";
import { api as Paths } from "configs/paths";
import Logging from "utils/logging";

const errorMock = { name: "Error", message: "Mocking error testing.", stack: "mock.tsx" };

/**
 * Utility class to mock out api requests without actually talking to the server.
 *
 * Used for testing purposes only.
 */
export default class Mock {
    /**
     * Mock a POST request.
     * @param path The path to mock.
     * @returns {Promise} Returns a Promise.
     */
    public static post(path: string): Promise<any> {
        const result: JsonResult = {
            data: null,
            status: 200,
            statusText: "OK",
        };

        Mock.log("Mocking POST: %s.", path);

        switch (path) {
            default:
                result.data = "POST: Mocked request.";
                break;
        }

        return new Promise((resolve, reject) => {
            if (Config.error) {
                Mock.log("Mocking POST: %s, rejecting with %o.", path, errorMock);
                reject(errorMock);
            } else {
                Mock.log("Mocking POST: %s, resolving with %o.", path, result);
                resolve(result);
            }
        });
    }

    /**
     * Mock a GET request.
     * @param path The path to mock.
     * @returns {Promise} Returns a Promise.
     */
    public static get(path: string): Promise<any> {
        const result: JsonResult = {
            data: null,
            status: 200,
            statusText: "OK",
        };

        Mock.log("Mocking GET: %s.", path);

        switch (path) {
            default: {
                Mock.log("Mocking GET: %s, not found.", path);
                result.data = "GET: Mocked request.";
                break;
            }
        }

        return new Promise((resolve, reject) => {
            if (Config.error) {
                Mock.log("Mocking GET: %s, rejecting with %o.", path, errorMock);
                reject(errorMock);
            } else {
                Mock.log("Mocking GET: %s, resolving with %o.", path, result);
                resolve(result);
            }
        });
    }

    protected static log(message: string, ...args: any[]): void {
        if (Config.log) {
            Logging.log(message, ...args);
        }
    }
}
