import { RuleTester } from "eslint";

(RuleTester as any).describe = function (text: string, method: any) {
  (RuleTester as any).it.title = text;
  return method.call(this);
};

(RuleTester as any).it = function (text: string, method: any) {
  test((RuleTester as any).it.title + ": " + text, method);
};

export default RuleTester;
