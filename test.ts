import * as xmd from "./Xmd"

let parser = new xmd.XmdParser()

console.log("\n");
console.log(parser.parse("This is the most simple content.").show_xmd());
parser.reset();

console.log("\n");
console.log(parser.parse("This is \\(a\\) sentence includes \\[characters\\] which must be \\\\escaped.").show_xmd());
parser.reset();

console.log("\n");
console.log(parser.parse("!").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("?[command]").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("!{command}").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("![command]").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("空のコマンドは許容されません。![  ]この文章はエラーになります。").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("これは複雑な文章です。ここにシンプルな![command]が含まれます。").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("これはエラーになるべき)です").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("複雑なコマンド。![command arg1 arg2 arg3]").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("これはエラー。![command arg1 arg2 arg3").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("これはエラー、![command arg1 arg2 arg3|").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("これはエラー、![command arg1 arg2 arg3| name").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("![command arg1 arg2 arg3 | name]").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("![command arg1 arg2 arg3 |name]").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("![command arg1 arg2 arg3 |name ]").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("これは内容を含む![command](複雑なコマンドを持つ文章です。)").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("これは内容を含む![command arg1 arg2 arg3 ](複雑なコマンドを持つ文章です。)").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("これは内容を含む![command arg1 arg2 arg3|](複雑なコマンドを持つ文章です。)").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("これは内容を含む![command arg1 arg2 arg3|   ](複雑なコマンドを持つ文章です。)").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("これは内容を含む![command arg1 arg2 arg3 |name](複雑なコマンドを持つ文章です。)").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("これは内容を含む![command arg1 arg2 arg3 |name ](複雑なコマンドを持つ文章です。)").show_xmd())
parser.reset();

console.log("\n");
console.log(parser.parse("これは内容を含む![command arg1 arg2 arg3 | name ](複雑なコマンドを持つ文章です。)").show_xmd())
parser.reset();
