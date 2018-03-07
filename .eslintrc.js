module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "globals": {
        "NEJ": false,
        "define": false
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-console": "off",
        "no-unused-vars": ["warn"],
        "linebreak-style": ["warn", "unix"]
    }
};