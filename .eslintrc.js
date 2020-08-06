module.exports = {
    root: true,
    extends: 'airbnb-base',
    env: {
        es6: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2020,
        // sourceType: 'module',
    },
    // For some reason this is needed to recognise BigInt despite using ES2020
    globals: {
        BigInt: true,
    },
    rules: {
        // Allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // Allow console during development
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',

        // Other custom rules
        'max-len': 'off',
        indent: ['error', 4, { SwitchCase: 1 }],


        // Simple function bodies can sometimes still be complex enough to benefit of the extra readability provided by a simple newline
        'arrow-body-style': 'off',

        // Allow omission of parens around a singular arrow function argument unless the arrow function has a block body
        'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],

        // Even AirBnB themselves allow this, just use with caution
        'no-bitwise': 'off',

        // Constant loop conditions can be useful; like when there must be other code before and after the break condition
        'no-constant-condition': ['off', { checkLoops: false }],

        // Another rule not specified by AirBnB themselves; continues can be useful to prevent excessive tabbing and separate logic
        'no-continue': 'off',

        // In some cases it can be way more logical to use an else return, allow both styles
        /** @see https://blog.javascripting.com/2015/09/07/fine-tuning-airbnbs-eslint-config/ */
        'no-else-return': 'off',

        // This seems like a fairly stupid rule to enable; it disables simple anonymous functions and arrow functions, even when only used as callback
        'no-loop-func': 'off',

        // Allow a maximum of 2 consecutive empty lines, with one at the end and none at the start of the file
        'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 0 }],

        // Operator precedence is a thing for a reason; there are plenty of cases where forcing extra brackets does not lead to an improvement
        'no-mixed-operators': 'off',

        // This rule sounds good in theory, but there are too many exceptions where reassignment is wanted/needed, and the whitelist doesn't suffice
        'no-param-reassign': 'off',

        // For this Node application, for .. of loops are just fine
        'no-restricted-syntax': 'off',

        // Specifying unused function arguments isn't a problem and can add clarity
        /** @see https://blog.javascripting.com/2015/09/07/fine-tuning-airbnbs-eslint-config/ */
        'no-unused-vars': ['error', {
            vars: 'local',
            args: 'none',
        }],

        // Increases the maximum allowed number of properties between curly braces from 3 to 4 (before forcing multiline)
        'object-curly-newline': ['error', {
            minProperties: 5,
            multiline: true,
            consistent: true,
        }],

        // Used 'after' since before airbnb-base enforced this rule with 'before', no need to change now
        'operator-linebreak': ['error', 'after'],

        // In some cases, regular string concatenation still looks and feels superior
        'prefer-template': 'off',

        /** @see https://github.com/airbnb/javascript#modules--no-webpack-loader-syntax */
        'import/no-webpack-loader-syntax': 'error',
    },
};
