# eslint-plugin-ct-macro

class order for ct macro

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-ct-macro`:

```
$ npm install eslint-plugin-ct-macro --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-ct-macro` globally.

## Usage

Add `ct-macro` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "ct-macro"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "ct-macro/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here
