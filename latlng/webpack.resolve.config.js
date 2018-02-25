const path = require("path");

module.exports = {
    resolve: {
        extensions: ["*", ".ts", ".tsx", ".js", ".jsx", ".scss"],
        modules: [
            path.resolve(__dirname, "src"),
            "node_modules"
        ]
    }
};