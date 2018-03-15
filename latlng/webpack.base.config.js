const path = require("path");
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");

const resolveConfig = require("./webpack.resolve.config");

const devEnv = "development" === process.env.ENV;
const testEnv = "test" === process.env.ENV;
const prodEnv = "production" === process.env.ENV;

module.exports = merge(resolveConfig, {
    entry: {
        app: ["./src/index.tsx"],
        vendor: [
            "axios",
            "papaparse",
            "react",
            "react-dom",
        ]
    },
    stats: false,
    output: {
        path: path.resolve(__dirname + "/wwwroot/js"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.tsx$/,
                exclude: "/node_modules/",
                loader: "tslint-loader"
            },
            {
                test: /\.tsx$/,
                exclude: /node_modules/,
                loader: "babel-loader!ts-loader"
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader!postcss-loader!sass-loader" })
            },
            {
                test: /\.(png|svg)$/,
                loader: "resolve-url-loader"
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: "file-loader?name=fonts/[name].[ext]"
            }
        ]
    },
    plugins: [
        new CommonsChunkPlugin({
            names: "vendor",
            minChunks: Infinity
        }),
        new ExtractTextPlugin({
            filename: "../css/[name].css",
            allChunks: true
        }),
        // Need to update /src/types/globals.tsx with anything defined here so typescript knows they exist.
        new DefinePlugin({
            APP: {
                ENV: {
                    DEV: devEnv,
                    TEST: testEnv,
                    PROD: prodEnv
                }
            }
        }),
        new FriendlyErrorsPlugin()
    ]
});