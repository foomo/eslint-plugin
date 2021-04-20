# Fix relative and absolute imports to invalid locations (no-package-imports)

Monorepo setups may introduce valid yet unwanted ES imports picked up by the IDE.
This rule aims at finding and fixing these problems.

## Rule Details

This rule detects invalid imports via the option configuration. For example you want to avoid imports from `../packages/*/src` and
replace these with `@organization/*`

Examples of **incorrect** code for this rule:

```js
import { Button } from "../../packages/components/src/Button";
```

Examples of **correct** code for this rule:

```js
import { Button } from "@organization/components/Button";
```

### Options

The rule accepts a list of **replacements**, below is an example of the configuration for the above example

```js
{
    "@foomo/no-package-imports": ["error", {
            options: [{
                invalidPrefix: "packages",
                invalidSuffix: "src",
                monorepoRoot: "@organization",
            }],
        }
    ]
}
```

#### Custom templates

One can also provide a custom replacement template **$1** is the package name **$2** is the import suffix e.g. everything after the **invalidSuffix**. Please note **$2** includes a slash so it can be omitted from the template.

```js
{
    "@foomo/no-package-imports": ["error", {
            options: [{
                invalidPrefix: "packages",
                invalidSuffix: "src",
                template: "@testprefix/$1/somepath$2",
            }],
        }
    ]
}
```
