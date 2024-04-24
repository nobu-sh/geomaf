// This script just heavily assumes build configuration doesn't change

const fs = require("node:fs");
const path = require("node:path");

const distDir = path.resolve(__dirname, "dist");
const packageJsonPath = path.resolve(__dirname, "package.json");

// Read the package.json file
let packageJson = require(packageJsonPath);

// Read all files in the dist directory
const files = fs.readdirSync(distDir);

// Get all the .js files in the dist directory
const jsFiles = files.filter(
	(file) => file.endsWith(".js") && file !== "index.js"
);

packageJson.exports = {
	".": {
		import: {
			default: "./dist/index.mjs",
			types: "./dist/index.d.mts"
		},
		require: {
			default: "./dist/index.js",
			types: "./dist/index.d.ts"
		}
	}
};

// Loop through all the .js files
for (const file of jsFiles) {
	// Get the name of the file without the .js extension
	const name = file.replace(".js", "");

	// Add all the exports information
	packageJson.exports[`./${name}`] = {
		import: {
			default: `./dist/${name}.mjs`,
			types: `./dist/${name}.d.mts`
		},
		require: {
			default: `./dist/${name}.js`,
			types: `./dist/${name}.d.ts`
		}
	};
}

// Write the package.json file
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log("Updated package.json exports!");
