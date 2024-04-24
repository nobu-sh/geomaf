require("@ariesclark/eslint-config/eslint-patch");
process.env["ESLINT_PROJECT_ROOT"] = __dirname;

/** @type {import("eslint").Linter.Config} */
module.exports = {
	extends: [
		"@ariesclark/eslint-config",
		"@ariesclark/eslint-config/node",
		"plugin:ava/recommended"
	],
	root: true,
	ignorePatterns: ["dist/", "node_modules/"],
	rules: {
		// Cool rule, but not for this project :<
		"unicorn/prevent-abbreviations": "off",
		// We love our magic numbers in math, this gets annoying
		"unicorn/numeric-separators-style": "off",
		// We extend the math namespace in this project
		"@typescript-eslint/no-namespace": "off"
	}
};
