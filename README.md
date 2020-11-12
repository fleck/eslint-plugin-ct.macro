# eslint-plugin-class-types

Check class order for when using https://github.com/fleck/class-types.macro

## Installation

You'll first need to install [ESLint](http://eslint.org):

```bash
yarn add eslint -D
# or via npm
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-class-types`:

```bash
yarn add eslint-plugin-class-types -D
# or via npm
$ npm install eslint-plugin-class-types --save-dev
```

## Usage

Add `class-types` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "class-types"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "class-types/class-order": 2
    }
}
```

## Supported Rules

class-types/class-order is the only rule. Set it to 1 and it will throw warnings. Setting it to 2 will throw errors.
