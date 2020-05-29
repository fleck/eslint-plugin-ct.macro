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
/**
 * Column of substrings found in classnames.d.ts
 *               22777         218494                 221725          222538    223035           224080
 */
const validOrder =
  'ct("other", "font-bold", "sm:tracking-wider", "text-indigo-600", "text-sm", "tracking-wide", "uppercase")';

ruleTester.run("class-order", rule, {
  valid: [validOrder],

  invalid: [
    {
      code: `ct(
        "font-bold",
        "uppercase",
        "other",
        "sm:tracking-wider",
        "tracking-wide",
        "text-sm",
        "text-indigo-600"
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
