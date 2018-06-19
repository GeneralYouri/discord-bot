// http://eslint.org/docs/user-guide/configuring
module.exports = {
    root: true,
    extends: 'airbnb-base',
    env: {
        node: true,
        es6: true,
    },
    parserOptions: {
        ecmaVersion: 2018,
    },
    rules: {
        // don't require .js extension when importing
        'import/extensions': [2, 'always', {
            'js': 'never',
        }],
        // allow optionalDependencies
        'import/no-extraneous-dependencies': [2, {
            'optionalDependencies': ['test/unit/index.js']
        }],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        // allow console during development
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,

        // Other custom rules
        'max-len': 0,
        indent: [2, 4],
        'no-param-reassign': [1, {
            props: true,
            ignorePropertyModificationsFor: [
                'acc', // for reduce accumulators
                'e', // for e.returnvalue
                'ctx', // for Koa routing
                'req', // for Express requests
                'request', // for Express requests
                'res', // for Express responses
                'response', // for Express responses
                '$scope', // for Angular 1 scopes
                'state', // for Vuex state handling
                'opts', // for handling/resolving options objects
                'options', // for handling/resolving options objects
            ]
        }],

        // Operator precedence is a thing for a reason; there are plenty of cases where forcing extra brackets does not lead to an improvement
        'no-mixed-operators': 0,

        // Simple function bodies can sometimes still be complex enough to benefit of the extra readability provided by a simple newline
        'arrow-body-style': 0,

        // In some cases, regular string concatenation still looks and feels superior
        'prefer-template': 0,

        // This seems like a fairly stupid rule to enable; it disables simple anonymous functions and arrow functions, even when only used as callback
        'no-loop-func': 0,

        // Even AirBnB themselves allow this, just use with caution
        'no-bitwise': 0,

        // Specifying unused function arguments isn't a problem and can add clarity
        // Also move this to a warning instead of an error as it can otherwise be REALLY annoying during development
        /** @see https://blog.javascripting.com/2015/09/07/fine-tuning-airbnbs-eslint-config/ */
        'no-unused-vars': [1, {
            'vars': 'local',
            'args': 'none',
        }],

        // In some cases it can be way more logical to use an else return, allow both styles
        /** @see https://blog.javascripting.com/2015/09/07/fine-tuning-airbnbs-eslint-config/ */
        'no-else-return': 0,
    },
};
