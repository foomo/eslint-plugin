# @foomo/eslint-plugin

eslint utility rules to effectively handle monorepo setups

## Installation

You'll first need to install [ESLint](http://eslint.org):

```bash
yarn add -D eslint
```

Next, install `@foomo/eslint-plugin`:

```bash
yarn add -D @foomo/eslint-plugin
```

## Usage

Add `@foomo/eslint-plugin` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["@foomo/eslint-plugin"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "@foomo/no-package-imports": ["error", {
      "options": [
        { "invalidPrefix": "packages", "invalidSuffix": "src", "monorepoRoot": "@organization" },
        { "invalidPrefix": "packages", "invalidSuffix": "src", "template": "@organization/$1/custom-prefix/$2" }
      ]
    }]
  }
}
```

## Supported Rules

- no-package-imports:
  fixes forbidden import paths
