
/**
 * Global constants defined in webpack.base.config.js.
 */
declare var APP: {
    ENV: {
        DEV: boolean,
        TEST: boolean,
        STAGING: boolean,
        PROD: boolean
    }
}

// Javascript library for creating and reading browser cookies.
declare class docCookies {
    public static setItem(name: string, value: string, end?: any, path?: string, domain?: string, secure?: boolean): void;
    public static getItem(name: string): any;
    public static removeItem(name: string, path?: string, domain?: string): boolean;
    public static hasItem(name: string): boolean;
    public static keys(): any;
};

/**
 * Self Assessment tool types.
 */
declare type Gender = "Female" | "Male" | "";

declare type AgeRange = "Under 25" | "25-39" | "40-49" | "50-64" | "65+" | "";

declare type YesNoType = "yes" | "no" | "";

declare class TopicConfig {
    public questions: (TopicQuestion | TopicQuestionMulti | TopicQuestionSlider)[];
    public name: string;
    public titleBig: string;
    public blurb: string;
}

declare class TopicQuestion {
    type: string;
    questionText: string;
}

declare interface MultiQuestion {
    question: string;
    subtext?: string;
    value: number;
}

declare class TopicQuestionMulti extends TopicQuestion {
    options: MultiQuestion[];
}

declare class TopicQuestionSlider extends TopicQuestion {
    lowText?: string;
    highText?: string;
    followUps?: {
        low: TopicQuestion[]; // 1-3
        moderate: TopicQuestion[]; // 4-7
        high: TopicQuestion[]; // 8 -10
    }
}

declare class TopicAnswers {
    [key: string]: string;
}

declare class Product {
    Id: number;
    Name: string;
    ParentName: string;
    Url: string;
    ImageUrl: string;
    ShortDescription: string;
}

declare class Recommendations {
    [key: string]: Product[];
}
