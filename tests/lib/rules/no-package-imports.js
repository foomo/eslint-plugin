/**
 * @fileoverview Fix relative and absolute imports to invalid locations
 * @author @gosticks
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-package-imports"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const incorrectImport = { messageId: "incorrectImport" };
const options = [
  {
    options: [
      {
        invalidPrefix: "packages",
        invalidSuffix: "src",
        monorepoRoot: "@monorepo",
      },
    ],
  },
];

var ruleTester = new RuleTester();
ruleTester.run("no-package-imports", rule, {
  valid: [
    {
      code: 'import Button from "@monorepo/components/Button"',
      parserOptions: { ecmaVersion: 6, sourceType: "module" },
      options,
    },
  ],

  invalid: [
    {
      code: 'import { Button } from "../../packages/components/src/Button"',
      output: 'import { Button } from "@monorepo/components/Button"',
      parserOptions: { ecmaVersion: 6, sourceType: "module" },
      options,
      errors: [incorrectImport],
    },
    {
      code:
        'import { Button } from "../../packages/components-combined/src/Button"',
      output: 'import { Button } from "@monorepo/components-combined/Button"',
      parserOptions: { ecmaVersion: 6, sourceType: "module" },
      options,
      errors: [incorrectImport],
    },
    {
      code: 'import Button from "../../packages/components/src/Button"',
      output: 'import Button from "@testprefix/components/somepath/Button"',
      parserOptions: { ecmaVersion: 6, sourceType: "module" },
      options: [
        {
          options: [
            {
              invalidPrefix: "packages",
              invalidSuffix: "src",
              template: "@testprefix/$1/somepath$2",
            },
          ],
        },
      ],
      errors: [incorrectImport],
    },
    {
      code: 'import Button from "../../../packages/components/src/Button"',
      output: 'import Button from "@monorepo/components/Button"',
      parserOptions: { ecmaVersion: 6, sourceType: "module" },
      options,
      errors: [incorrectImport],
    },
    {
      code: 'import Button from "packages/components/src/Button"',
      output: 'import Button from "@monorepo/components/Button"',
      parserOptions: { ecmaVersion: 6, sourceType: "module" },
      options,
      errors: [incorrectImport],
    },
  ],
});
