const path = require("path");

module.exports = {
    resolve: {
        extensions: ["*", ".ts", ".tsx", ".js", ".jsx", ".scss"],
        alias: {
            utils: path.resolve(__dirname, "src/utils")
        },
        modules: [
            path.resolve(__dirname, "src"),
            "node_modules"
        ]
    }
};