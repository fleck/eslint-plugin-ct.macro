import eslint from "eslint";
import { isEqual } from "lodash";
import {
  defaultDirectory,
  classNamesDeclarationFilename,
} from "postcss-class-types";
import fs from "fs-extra";
import path from "path";
import type { CallExpression, Node } from "estree";

const declarationPath = path.join(
  defaultDirectory,
  classNamesDeclarationFilename
);

const loadAndParseTypes = () =>
  fs
    .readFileSync(declarationPath)
    .toString()
    .split(' "')
    .map((dirtyClassName) => dirtyClassName.replace(/[|\s"]/g, ""));

let allClasses = loadAndParseTypes();

let classesFileLastModified = fs.statSync(declarationPath).mtime.toISOString();

const callToCt = (node: Node): node is CallExpression =>
  "callee" in node && "name" in node.callee && node.callee.name === "ct";

const orderIfCt = (node: Node, context: eslint.Rule.RuleContext) => {
  if (callToCt(node)) {
    const { text } = order(node, context);
    return text;
  } else {
    return context.getSourceCode().getText(node);
  }
};

const order = (node: CallExpression, context: eslint.Rule.RuleContext) => {
  const conditionalExpressions = node.arguments
    .filter(function nonClasses<T extends typeof node.arguments[number]>(
      argument: T
    ): argument is Extract<T, { type: "ConditionalExpression" }> {
      return argument.type === "ConditionalExpression";
    })
    .map(
      (conditionalExpression): string =>
        `${context
          .getSourceCode()
          .getText(conditionalExpression.test)} ? ${orderIfCt(
          conditionalExpression.consequent,
          context
        )} : ${orderIfCt(conditionalExpression.alternate, context)}`
    );

  const identifiers = node.arguments
    .filter(function nonClasses<T extends typeof node.arguments[number]>(
      argument: T
    ): argument is Extract<T, { type: "Identifier" }> {
      return argument.type === "Identifier";
    })
    .map((identifier) => identifier.name);

  const classList = node.arguments
    .filter(function nonClasses<T extends typeof node.arguments[number]>(
      argument: T
    ): argument is Extract<T, { type: "Literal" }> {
      return argument.type === "Literal";
    })
    .map((literalClass) => String(literalClass.value));

  const sortedClassList = classList
    .concat()
    .sort((a, b) => allClasses.indexOf(a) - allClasses.indexOf(b));

  return {
    classList,
    sortedClassList,
    text: `ct("${sortedClassList.join('", "')}"${
      identifiers.length ? ", " : ""
    }${identifiers.join(", ")}${
      conditionalExpressions.length ? ", " : ""
    }${conditionalExpressions.join(", ")})`,
  };
};

/**
 * @fileoverview consistent order for classes
 */

const rule: eslint.Rule.RuleModule = {
  meta: {
    docs: {
      description: "consistent order for classes",
      category: "Stylistic Issues",
      recommended: true,
    },
    fixable: "code",
    schema: [],
    messages: {
      wrongOrder: `Classes in the wrong order

expected: {{expected}}

received: {{received}}`,
    },
  },

  create: function (context) {
    const newClassesFileLastModified = fs
      .statSync(declarationPath)
      .mtime.toISOString();

    if (newClassesFileLastModified !== classesFileLastModified) {
      allClasses = loadAndParseTypes();
      classesFileLastModified = newClassesFileLastModified;
    }

    return {
      CallExpression(node) {
        if (!callToCt(node)) {
          return;
        }

        const { classList, sortedClassList, text } = order(node, context);

        if (!isEqual(classList, sortedClassList)) {
          context.report({
            node,
            messageId: "wrongOrder",
            data: {
              expected: `ct("${sortedClassList.join('", "')}")`,
              received: `ct("${classList.join('", "')}")`,
            },
            fix(fixer) {
              return fixer.replaceText(node, text);
            },
          });
        }
      },
    };
  },
};

export default rule;
