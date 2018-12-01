import * as pemd from "./Pemd"

let parser = new pemd.PemdParser()

console.log(parser.parse("This is the most simple content.").show_pemd())
parser.reset();

console.log(parser.parse("This is \\(a\\) sentence includes \\[characters\\] which must be \\\\escaped.").show_pemd())
parser.reset();

console.log(parser.parse("!").show_pemd())
parser.reset();

console.log(parser.parse("?[command]").show_pemd())
parser.reset();

console.log(parser.parse("!{command}").show_pemd())
parser.reset();

console.log(parser.parse("![command]").show_pemd())
parser.reset();

console.log(parser.parse("空のコマンドは許容されません。![  ]この文章はエラーになります。").show_pemd())
parser.reset();

console.log(parser.parse("これは複雑な文章です。ここにシンプルな![command]が含まれます。").show_pemd())
parser.reset();

console.log(parser.parse("複雑なコマンド。![command arg1 arg2 arg3]").show_pemd())
parser.reset();

console.log(parser.parse("これはエラー。![command arg1 arg2 arg3").show_pemd())
parser.reset();
