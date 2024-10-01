module.exports = {
    roots: ["../starter-kit/src"],
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest", // Ensure Babel transforms the files
    },
    transformIgnorePatterns: [
        "/node_modules/", // Ignore node_modules transformations except specific packages
    ],
    moduleNameMapper: {
        "^.+\\.(css|less|scss)$": "babel-jest"
    }
};
