import eslint from "eslint";
import { compact, isEqual } from "lodash";
import { defaultDirectory, classNamesDeclarationFilename } from "ct.macro";
import fs from "fs-extra";
import path from "path";

const declarationPath = path.join(
  defaultDirectory,
  classNamesDeclarationFilename
);

const loadAndParseTypes = () =>
  fs
    .readFileSync(declarationPath)
    .toString()
    .split(' "')
    .map(dirtyClassName => dirtyClassName.replace(/[|\s"]/g, ""));

let classesFileLastModified = fs.statSync(declarationPath).mtime.toISOString();

let allClasses = loadAndParseTypes();

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

  create: function(context) {
    const newClassesFileLastModified = fs
      .statSync(declarationPath)
      .mtime.toISOString();

    if (newClassesFileLastModified !== classesFileLastModified) {
      allClasses = loadAndParseTypes();
      classesFileLastModified = newClassesFileLastModified;
    }

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

        const sortedClassList = classList
          .concat()
          .sort((a, b) => allClasses.indexOf(a) - allClasses.indexOf(b));

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
