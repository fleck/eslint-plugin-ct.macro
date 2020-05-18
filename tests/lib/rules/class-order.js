/**
 * @fileoverview consistent order for classes
 * @author Jonathan Fleckenstein
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/class-order"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("class-order", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "need to add failing example here",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
