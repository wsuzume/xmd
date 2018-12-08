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


console.log("\n");
console.log(parser.parse("エラー![command arg1 arg2 | name]?(複雑なコマンド)です。").show_xmd());
parser.reset()

console.log("\n");
console.log(parser.parse("detailを含む![command arg1 arg2 | name]?{}(複雑なコマンド)です。").show_xmd());
parser.reset()

console.log("\n");
console.log(parser.parse("detailを含む![command arg1 arg2 | name]?{   }(複雑なコマンド)です。").show_xmd());
parser.reset()

console.log("\n");
console.log(parser.parse("detailを含む![command arg1 arg2 | name]?{key1;}(複雑なコマンド)です。").show_xmd());
parser.reset()

console.log("\n");
console.log(parser.parse("detailを含む![command arg1 arg2 | name]?{ key1: }(複雑なコマンド)です。").show_xmd());
parser.reset()

console.log("\n");
console.log(parser.parse("detailを含む![command arg1 arg2 | name]?{ key1: value1; }(複雑なコマンド)です。").show_xmd());
parser.reset()

console.log("\n");
console.log(parser.parse("detailを含む![command arg1 arg2 | name]?{ key1: value1; key2: value2; key3: value3; }(複雑なコマンド)です。").show_xmd());
parser.reset()

console.log("\n");
console.log(parser.parse("エラーになる![command arg1 arg2 | name]?{ key1: value1; key1: value2; key3: value3; }(複雑なコマンド)です。").show_xmd());
parser.reset()

console.log("\n");
console.log(parser.parse("detailとmetaを含む![command arg1 arg2 | name]?{ key1: value1; key2: value2; key3: value3; }#{ meta1: value1; meta2: value2; meta3: value3; }(非常に複雑なコマンド)です。").show_xmd());
parser.reset()

console.log("\n");
console.log(parser.parse("detailとmetaを含む![command arg1 arg2 | name]?{ key1: value1; key2: value2; key3: value3; }#{ meta1: value1; meta2: value2; meta3: value3; }&{   }(非常に複雑なコマンド)です。").show_xmd());
parser.reset()

console.log("\n");
let txt = [
"This is almost full set of XmdCommand!",
"![command arg1 arg2 arg3 | name]?{",
"   key1: value1;",
"   key2: value2;",
"   key3: value3;",
"   key4: value4;",
"}#{",
"   meta1: value1;",
"   meta2: value2;",
"   meta3: value3;",
"   meta4: value4;",
"}&{",
"   ![command | ref1](リファレンス1です)",
"   ![command | ref2](リファレンス2です)",
"   ![command | ref3](リファレンス3です)",
"   ![command | ref4](リファレンス4です)",
"}(それはそれは複雑なコマンド)です。"].join("\n");
console.log(txt);
console.log(parser.parse(txt).show_xmd());
parser.reset()
