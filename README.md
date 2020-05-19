# eslint-plugin-ct.macro

Check class order for ct.macro

## Installation

You'll first need to install [ESLint](http://eslint.org):

```bash
yarn add eslint -D
# or via npm
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-ct.macro`:

```bash
yarn add eslint-plugin-ct.macro -D
# or via npm
$ npm install eslint-plugin-ct.macro --save-dev
```

## Usage

Add `ct.macro` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "ct.macro"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "ct.macro/class-order": 2
    }
}
```

## Supported Rules

ct.macro/class-order is the only rule. Set it to 1 and it will throw warnings. Setting it to 2 will throw errors.
