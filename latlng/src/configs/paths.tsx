import React from "react";

/*
    All paths for easy reference.
*/

/**
 * External websites.
 */
export const external = {
    twitterShare: "https://twitter.com/intent/tweet",
};

/**
 * Internal site pages.
 */
export const site = {
    home: "/",
};

/**
 * API paths.
 */
export const api = {
    user: {
        register: "/api/member/register",
        login: "/api/member/login",
        logout: "/logout",
        update: "/api/member/update",
        forgot: "/api/member/forgot",
        favourite: "/api/member/favourite",
    },
    form: {
        contact: "/api/form/contact",
    },
    tool: {
        calculate: "/api/tool/calculate",
        submit: "/api/tool/submit",
    },
};
