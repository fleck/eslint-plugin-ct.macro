import rule from "../src/rules/singleClassPerArg";
import RuleTester from "./JestRuleTester";

const ruleTester = new RuleTester();

const validOrder =
  'ct("font-bold", "tracking-wide", "mx-2", "uppercase", "sm:tracking-wider")';

ruleTester.run("single-class", rule, {
  valid: [validOrder],

  invalid: [
    {
      code: `ct(
        "font-bold tracking-wide mx-2",
        "uppercase",
        "sm:tracking-wider"
      )`,
      errors: [
        {
          type: "CallExpression",
        },
      ],
      output: validOrder,
    },
  ],
});
