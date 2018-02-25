const merge = require("webpack-merge");
const LoaderOptionsPlugin = require("webpack/lib/LoaderOptionsPlugin");

const baseConfig = require("./webpack.base.config");

module.exports = merge(baseConfig, {
    devtool: "inline-source-map",
    plugins: [
        new LoaderOptionsPlugin({
            options: {
                tslint: {
                    emitErrors: true
                }
            }
        })
    ]
});