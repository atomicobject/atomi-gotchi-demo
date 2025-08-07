// Change to use dynamic import instead of assert syntax
const gtsConfigUrl = new URL("./node_modules/gts/.prettierrc.json", import.meta.url);
const gtsConfigData = JSON.parse(
  await import("fs").then((fs) => fs.promises.readFile(gtsConfigUrl, "utf-8"))
);

/**
 * This is the Prettier configuration file
 *
 * @type {import("prettier").Config}
 * @see https://prettier.io/docs/en/configuration
 */
const config = {
  ...gtsConfigData,
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  printWidth: 80,
  proseWrap: "always",
  useTabs: false,
  bracketSpacing: true,
  // Additional Next.js specific settings
  plugins: [
    "prettier-plugin-packagejson",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-jsdoc",
  ],
  // support tsdoc for jsdoc
  tsdoc: true,
  // Import order configuration
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "",
    "^(next/(.*)$)|^(next$)",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/(.*)$",
    "",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
};

export default config;
