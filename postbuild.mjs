"use strict";

import { join, dirname, basename } from "path";
import { rename, readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import glob from "globby";

(async () => {
	const cwd = join(fileURLToPath(import.meta.url), "../dist");

	for (const name of await glob(`./cjs/**/*.{js,js.map}`, { cwd })) {
		const filename = join(cwd, name);

		if (filename.endsWith(".map")) {
			const content = await readFile(filename, "utf-8").then(JSON.parse);
			content.file = content.file.replace(/\.js$/, ".cjs");
			await writeFile(filename, JSON.stringify(content), "utf-8");
		}

		const newFilename = filename.replace(/\.js(\.map)?$/, ".cjs$1");
		await rename(filename, newFilename);
	}

})().catch(error => {
	console.error(error);
	process.exit(1);
});
