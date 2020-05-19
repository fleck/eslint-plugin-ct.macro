import rule from "../src/rules/class-order";
import RuleTester from "./JestRuleTester";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// var rule = require("../../../lib/rules/class-order");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const validOrder =
  'ct("other", "text-sm", "font-bold", "tracking-wide", "text-indigo-600", "uppercase")';

ruleTester.run("class-order", rule, {
  valid: [validOrder],

  invalid: [
    {
      code:
        "ct('font-bold', 'other', 'uppercase', 'tracking-wide', 'text-sm', 'text-indigo-600')",
      errors: [
        {
          message: `Classes in the wrong order

expected: ${validOrder}

received: ct("font-bold", "other", "uppercase", "tracking-wide", "text-sm", "text-indigo-600")`,
          type: "CallExpression",
        },
      ],
    },
  ],
});
