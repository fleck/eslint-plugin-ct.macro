import singleClassPerArg from "rules/singleClassPerArg";
import classOrder from "./rules/classOrder";

module.exports = {
  rules: {
    "class-order": classOrder,
    "single-class-per-arg": singleClassPerArg,
  },
};
