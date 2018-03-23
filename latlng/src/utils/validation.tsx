
const requiredError: string = "This field is required";

/**
 * Utility class to handle form field validations.
 *
 * Funtions return null if the field is valid, and a string containing the error message if not.
 */
export default class Validation {

    /**
     *
     * @param {string} str The string to validate.
     * @param {boolean} required Whether or not a length of zero is allowed. Defaults to true.
     * @returns {string} Returns a message if the string is not valid. Null if valid.
     */
    public static String(str: string, required: boolean = true): string | null {
        if (null === str || undefined === str) {
            return requiredError;
        }

        if (required && 0 === str.length) {
            return requiredError;
        }

        return null;
    }

    /**
     * Validates that the given password meets our requirements.
     * @param {string} pass The password to validate.
     * @param {boolean} required Whether or not a length of zero is allowed. Defaults to true.
     * @returns {string} Returns a message if the password is not valid. Null if valid.
     */
    public static Password(pass: string, required: boolean = true): string | null {
        const stringError: string | null = Validation.String(pass);

        if (null === stringError) {
            if (10 > pass.length) {
                return "Password must be at least 10 characters in length";
            }
            return null;
        } else {
            return stringError;
        }
    }

    /**
     * Validates that the given string is probably an actual email.
     * @param {string} email The email to validate.
     * @param {boolean} required Whether or not a length of zero is allowed. Defaults to true.
     * @returns {string} Returns a message if the string is not valid. Null if valid.
     */
    public static Email(email: string, required: boolean = true) {
        if (null === email || undefined === email) {
            return requiredError;
        }

        if (required && 0 === email.length) {
            return requiredError;
        }

        // Simple something@something.something check.
        if (!email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
            return "Please enter a valid email address";
        }

        return null;
    }

    /**
     * Validates that the given number is actually a number.
     * @param {any} num A string containing number to validate.
     * @param {any} required Whether or not a length of zero is allowed. Defaults to true.
     * @returns {string} Returns a message if the string is not valid. Null if valid.
     */
    public static Number(num: string, required: boolean = true) {
        if (null === num || undefined === num) {
            return requiredError;
        }

        if (required && 0 === num.length) {
            return requiredError;
        }

        if (9 > num.length) {
            return "Phone number should be at least 9 numbers long";
        }

        if (!num.match(/^[0-9]+$/)) {
            return "Please enter a valid phone number";
        }

        return null;
    }
}
