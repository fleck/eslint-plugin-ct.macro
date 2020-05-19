import eslint from "eslint";
import TWClassesSorter from "tailwind-classes-sorter";
import { compact, isEqual } from "lodash";

const twClassesSorter = new TWClassesSorter();

/**
 * @fileoverview consistent order for classes
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: eslint.Rule.RuleModule = {
  meta: {
    docs: {
      description: "consistent order for classes",
      category: "Fill me in",
      recommended: true,
    },
    fixable: "code", // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
    messages: {
      wrongOrder: `Classes in the wrong order

expected: {{expected}}

received: {{received}}`,
    },
  },

  create: function(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression(node) {
        if (
          !(
            "callee" in node &&
            "name" in node.callee &&
            node.callee.name === "ct"
          )
        ) {
          return;
        }

        const classes = node.arguments.map(argument => {
          if ("value" in argument) {
            return String(argument.value);
          } else {
            return undefined;
          }
        });

        const classList = compact(classes);

        const sortedClassList = twClassesSorter.sortClasslist(
          classList.concat()
        );

        if (!isEqual(classList, sortedClassList)) {
          context.report({
            node,
            messageId: "wrongOrder",
            data: {
              expected: `ct("${sortedClassList.join('", "')}")`,
              received: `ct("${classList.join('", "')}")`,
            },
            fix(fixer) {
              return fixer.replaceText(
                node,
                `ct("${sortedClassList.join('", "')}")`
              );
            },
          });
        }
      },
    };
  },
};

export default rule;
