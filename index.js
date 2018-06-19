

function main() {
    console.log('Hello World');
}

module.exports.main = main;
module.exports.default = module.exports;

if (module === require.main) {
    module.exports.main();
}
