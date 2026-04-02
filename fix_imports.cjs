const fs = require("fs");
const { execSync } = require("child_process");

try {
	execSync("npx tsc --project tsconfig.app.json --noEmit", { stdio: "pipe" });
} catch (error) {
	const output = error.stdout.toString();
	console.log("Got TS errors to parse...");

	const lines = output.split("\n");
	const typeImportErrors = [];

	for (const line of lines) {
		// 1. TS2614: "Module '"..."' has no exported member 'X'. Did you mean to use 'import X from "..."' instead?"
		const match2614 = line.match(
			/^(.*?)\((\d+),(\d+)\): error TS2614: Module '([^']+)' has no exported member '([^']+)'. Did you mean to use 'import ([^ ]+) from "([^"]+)"'/
		);
		if (match2614) {
			const [, filePath, row, col, mod, exportName, defaultName, modPath] = match2614;
			const absolutePath = filePath.trim();
			let content = fs.readFileSync(absolutePath, "utf-8");

			// we are finding: `import { ... , name , ... } from 'mod'`
			// or `import { name } from 'mod'`
			// The easiest way is regex or AST. Regex:
			// regex to match `name` inside `{ ... }` from `mod`
			// Wait, simpler: if it's the *only* import inside `{}`:
			// `import { Header } from "@/components/Header"` -> `import Header from "@/components/Header"`
			// if it's mixed: `import { Header, SomethingElse } from "@/components/Header"` -> `import Header, { SomethingElse } from "@/components/Header"`

			// we'll just read AST to do it safely
		}

		// 2. TS1484: "'X' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled."
		const match1484 = line.match(/^(.*?)\((\d+),(\d+)\): error TS1484: '([^']+)' is a type/);
		if (match1484) {
			typeImportErrors.push(match1484);
		}
	}
}
