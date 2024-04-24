import { defineConfig, type Options } from "tsup";

const Banner = `/*
* Copyright (c) 2024 nobu-sh
*
* This software is licensed under the terms of the MIT license.
* For details, see the LICENSE file in the root directory of this project.
*/`;

export default defineConfig((options: Options) => ({
	// Creates an entry point for each file and the index exports all of them
	entry: ["src/*.ts"],

	// Bundle information
	target: "es2016",
	dts: true,
	clean: true,
	minify: true,
	splitting: false,

	// Output formats
	format: ["esm", "cjs"],
	skipNodeModulesBundle: true,

	sourcemap: true,

	// File banner
	banner: {
		js: Banner
	},
	...options
}));
