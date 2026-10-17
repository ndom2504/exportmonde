/**
 * Create React App loads fork-ts-checker-webpack-plugin while building the
 * webpack config. That package's ajv-keywords 3.x crashes on Node 24 when
 * ajv 8 is installed (`formats` has no `date`). The production bundle does
 * not type-check, so replace the package entry with a no-op before Craco starts.
 */
const fs = require("fs");
const path = require("path");

const stub = `'use strict';
class ForkTsCheckerWebpackPlugin {
  apply() {}
}
module.exports = ForkTsCheckerWebpackPlugin;
`;

let pkgJsonPath;
try {
  pkgJsonPath = require.resolve("fork-ts-checker-webpack-plugin/package.json");
} catch (err) {
  console.warn("fork-ts-checker-webpack-plugin is not installed; nothing to stub.");
  process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
const entry = path.resolve(path.dirname(pkgJsonPath), pkg.main || "lib/index.js");
fs.writeFileSync(entry, stub);
console.log("Stubbed TypeScript checker:", entry);
