/**
 * @fileoverview Fix relative and absolute imports to invalid locations
 * @author @gosticks
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Fix relative and absolute imports to invalid locations",
      category: "Possible Errors",
      recommended: false,
    },
    fixable: "code", // or "code" or "whitespace"
    schema: [
      {
        type: "object",
        properties: {
          options: {
            type: "array",
            items: {
              anyOf: [
                {
                  type: "object",
                  properties: {
                    regexString: {
                      type: "string",
                    },
                    invalidPrefix: {
                      type: "string",
                    },
                    invalidSuffix: {
                      type: "string",
                    },
                    monorepoRoot: {
                      type: "string",
                    },
                    template: {
                      type: "string",
                    },
                  },
                  additionalProperties: true,
                },
              ],
            },
          },
        },
      },
    ],
    messages: {
      incorrectImport: "Import is invalid within the current monorepo setup",
    },
  },

  create: function (context) {
    // create a replacer regex and a target string
    const replacers = context.options[0].options.map((option) => [
      // match all string [../]*$invalidPrefix/anything/$invalidSuffix[/anything]
      option.regexString ? 
        new RegExp(option.regexString) : 
        new RegExp(
          `(?:(?:..\\/)*${option.invalidPrefix})+\\/([^\\/]+)${option.invalidSuffix !== "" ? `\\/${option.invalidSuffix}` : ''}(\\/(.+))?`
        ),
      option.template ?? `${option.monorepoRoot}/$1$2`,
    ]);

    /**
     * report an error.
     * @param {ASTNode} node the node to report.
     * @param {[RegExp, string]} replacer regex to match and template for substitution
     * @returns {void}
     */
    function report(node, [replacer, str]) {
      context.report({
        node,
        messageId: "incorrectImport",
        fix: function (fixer) {
          return fixer.replaceTextRange(
            [node.source.range[0] + 1, node.source.range[1] - 1],
            `${node.source.value.replace(replacer, str)}`
          );
        },
      });
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        // iterate over each replacer pair and substitute import source if needed
        replacers.forEach(([replacer, str]) => {
          const matchResults = node.source.value.match(replacer);
          if (matchResults) {
            report(node, [replacer, str]);
          }
        });
      },
    };
  },
};
