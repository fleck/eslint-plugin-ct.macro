import eslint from "eslint";
import { compact, isEqual } from "lodash";
import { defaultDirectory, classnamesJSONFilename } from "ct.macro";
import fs from "fs-extra";
import path from "path";

const classnamesFilePath = path.join(defaultDirectory, classnamesJSONFilename);

let classesFileLastModified = fs.statSync(classnamesFilePath);

let allClasses = fs.readJSONSync(classnamesFilePath);

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
    const newClassesFileLastModified = fs.statSync(classnamesFilePath);

    if (newClassesFileLastModified !== classesFileLastModified) {
      allClasses = fs.readJSONSync(classnamesFilePath);
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
