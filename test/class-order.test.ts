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
 *               14449         27813             32423      32555        32863           82326
 */
const validOrder =
  'ct("other", "font-bold", "text-sm", "text-indigo-600", "uppercase", "tracking-wide", "sm:tracking-wider")';

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

const validOrderWithIdentifiers =
  'ct("other", "font-bold", "text-sm", "text-indigo-600", "uppercase", "tracking-wide", "sm:tracking-wider", otherStyle, sharedStyle)';

ruleTester.run("class-order", rule, {
  valid: [validOrderWithIdentifiers],

  invalid: [
    {
      code: `ct(
        otherStyle,
        "font-bold",
        "uppercase",
        sharedStyle,
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
      output: validOrderWithIdentifiers,
    },
  ],
});

const validTernary =
  'ct("other", "font-bold", "text-sm", "text-indigo-600", "uppercase", "tracking-wide", "sm:tracking-wider", otherStyle, videoRef.current ? "block" : "")';

ruleTester.run("class-order", rule, {
  valid: [validTernary],

  invalid: [
    {
      code: `ct(
        otherStyle,
        "font-bold",
        "uppercase",
        "other",
        videoRef.current ? "block" : "",
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
      output: validTernary,
    },
  ],
});

const validNestedCall =
  'ct("other", "font-bold", "text-sm", "text-indigo-600", "uppercase", "tracking-wide", "sm:tracking-wider", otherStyle, videoRef.current ? ct("font-bold", "text-sm") : "")';

ruleTester.run("class-order", rule, {
  valid: [validNestedCall],

  invalid: [
    {
      code: `ct(
        otherStyle,
        "font-bold",
        "uppercase",
        "other",
        videoRef.current ? ct("text-sm", "font-bold") : "",
        "sm:tracking-wider",
        "tracking-wide",
        "text-sm",
        "text-indigo-600"
      )`,
      errors: [
        {
          type: "CallExpression",
        },
        {
          type: "CallExpression",
        },
      ],
      output: validNestedCall,
    },
  ],
});
