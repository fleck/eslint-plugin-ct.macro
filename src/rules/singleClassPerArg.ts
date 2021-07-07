import eslint from "eslint";
import type { CallExpression, Node } from "estree";

const callToCt = (node: Node): node is CallExpression =>
  "callee" in node && "name" in node.callee && node.callee.name === "ct";

const split = (node: CallExpression, context: eslint.Rule.RuleContext) => {
  const stringArguments = node.arguments.filter(function nonClasses<
    T extends typeof node.arguments[number]
  >(
    argument: T
  ): argument is Extract<T, { type: "Literal" }> & { value: string } {
    return argument.type === "Literal" && typeof argument.value === "string";
  });

  let splitStringArguments: string[] = [];

  stringArguments.forEach((argument) => {
    splitStringArguments = splitStringArguments.concat(
      argument.value.split(" ")
    );
  });

  const nonStringArguments = node.arguments
    .filter((argument) => argument.type !== "Literal")
    .map((argument) => context.getSourceCode().getText(argument));

  return {
    text: `ct("${splitStringArguments.join('", "')}"${
      nonStringArguments.length ? `, ${nonStringArguments.join(", ")}` : ""
    })`,
    stringArguments,
    splitStringArguments,
  };
};

/**
 * @fileoverview consistent order for classes
 */

const rule: eslint.Rule.RuleModule = {
  meta: {
    docs: {
      description: "single class per argument",
      category: "Stylistic Issues",
      recommended: true,
    },
    fixable: "code",
    schema: [],
    messages: {
      multipleClassesInArg: `You may only put a single class in each argument

expected: {{expected}}

received: {{received}}`,
    },
  },

  create: function (context) {
    return {
      CallExpression(node) {
        if (!callToCt(node)) {
          return;
        }

        const { text, stringArguments, splitStringArguments } = split(
          node,
          context
        );

        if (splitStringArguments.length === stringArguments.length) {
          return;
        }

        context.report({
          node,
          messageId: "multipleClassesInArg",
          data: {
            expected: `ct("${text}")`,
            received: `ct("${node.arguments
              .map((argument) => context.getSourceCode().getText(argument))
              .join(", ")}")`,
          },
          fix(fixer) {
            return fixer.replaceText(node, text);
          },
        });
      },
    };
  },
};

export default rule;
