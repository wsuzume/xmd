export class PemdError implements Error {
    public name = "PemdError";
    constructor(public message: string) {
    }

    public toString(): string {
        return this.name + ": " + this.message;
    }
}

export class PemdCommand {
    private id: string;

    private _command: string;
    private _args: string[];
    private _name: string;
    private _detail: { [key: string]: any; };
    private _meta: { [key: string]: any; };
    private _reference: { [key: string]: PemdCommand; };
    private _content: string;

    set command(command: string) {
        this._command = command;
    }

    get command(): string {
        return this._command;
    }

    set args(args: string[]) {
        this._args = (args === undefined ? [] : args);
    }

    get args(): string[] {
        return this._args;
    }

    set name(name: string) {
        this._name = (name === undefined ? "" : name);
    }

    get name(): string {
        return this._name;
    }

    set detail(detail: { [key: string]: any; }) {
        this._detail = (detail === undefined ? {} : detail);
    }

    get detail(): { [key: string]: any; } {
        return this._detail;
    }

    set meta(meta: { [key: string]: any; }) {
        this._meta = (meta === undefined ? {} : meta);
    }

    get meta(): { [key:string]: any; } {
        return this._meta;
    }

    set reference(reference: { [key: string]: PemdCommand; }) {
        this._reference = (reference === undefined ? {} : reference);
    }

    get reference(): { [key: string]: PemdCommand; } {
        return this._reference;
    }

    set content(content: string) {
        this._content = (content === undefined ? "" : content);
    }

    get content(): string {
        return this._content;
    }

    constructor(
        command: string,
        args?: string[],
        name?: string,
        detail?: { [key: string]: any; },
        meta?: { [key: string]: any; },
        reference?: { [key: string]: PemdCommand; },
        content?: string
    ) {
        this.command = command;
        this.args = args;
        this.name = name;
        this.detail = detail;
        this.meta = meta;
        this.reference = reference;
        this.content = content;
    }

    public show(): string {
        return `![${this.command}](${this.content})`;
    }

    public appendReference(key: string, command: PemdCommand) {
        this.reference[key] = command;
    }
}

export class PemdDocument {
    public root: PemdCommand;
    private _error: PemdError;

    constructor() {
        this.root = new PemdCommand("document");
    }

    public error() {
        return this._error;
    }

    md2pemd(str: string) {

    }

    parse_pemd(str: string) {

    }

    show_pemd(): string {
        return this.root.show();
    }

    show_json(): string {
        return "";
    }

    show_html(): string {
        return "";
    }

    show_css(): string {
        return "";
    }
}

function ParseError(message: string): ParseResult {
    let ret = new ParseResult();
    ret.setError(message);
    return ret;
}

class ParseResult {
    private _ErrorOccurred: boolean;
    public result: any;
    public readLength: number;
    public lastChar: string;
    public identifier: string;
    public command: PemdCommand;
    public error: PemdError;
    public reference: { [key: string]: PemdCommand; };
    constructor(result?: any, readLength?: number, lastChar?: string) {
        this.ErrorOccurred = false;
        this.error = null;
        this.result = (result === undefined ? "" : result);
        this.readLength = (readLength === undefined ? 0 : readLength);
        this.lastChar = (lastChar === undefined ? "" : lastChar);
    }

    get ErrorOccurred(): boolean {
        return this._ErrorOccurred;
    }

    set ErrorOccurred(b: boolean) {
        this._ErrorOccurred = b;
    }

    public setError(message: string) {
        this.ErrorOccurred = true;
        this.error = new PemdError(message);
    }

}

function is_one_of(c: string, str: string) {
    for (let i = 0; i < str.length; i++) {
        if (c == str.charAt(i)) {
            return true;
        }
    }
    return false;
}

function is_space(c: string): boolean {
    return is_one_of(c, " \t\n")
}

function is_commandname_end(c: string): boolean {
    return is_one_of(c, "]|") || is_space(c);
}

function must_be_escape(c: string): boolean {
    return is_one_of(c, "[]()\\");
}

export class PemdParser {
    private doc: PemdDocument;
    private source;
    private global_table: { [key: string]: PemdCommand; };

    constructor(source?: string) {
        this.reset(source);
    }

    public reset(source?: string) {
        this.doc = new PemdDocument();
        this.source = (source === undefined ? "" : source);
    }

    public parse(newSource?: string) {
        this.reset(newSource);

        let result = this.parse_content(0);
        if (result.ErrorOccurred) {
            console.log(result.error);
        } else {
            this.doc.root.content = result.result;
        }
        return this.doc;
    }

    private parse_content(i: number, both_end_paren?: boolean): ParseResult {
        console.log("parse_content", both_end_paren);
        let is_paren_end: boolean = (both_end_paren === undefined ? false : both_end_paren);
        let curContent: string = "";
        let count: number = 0;
        let j = i;

        if (is_paren_end) {
            if (this.source.charAt(j) != "(") {
                return ParseError("content with parenthesis ends must be start with '('");
            }
            count++;
            j++;
        }

        for (;; j++) {
            count++;
            let c = this.source.charAt(j);
            //console.log(c)
            if (c == "") {
                // here is the basis of this recursive descent parser
                return new ParseResult(curContent, count, c);
            } else if (c == ")") {
                console.log(is_paren_end);
                if (is_paren_end) {
                    return new ParseResult(curContent, count, c);
                } else {
                    return ParseError("reached ')' which is not paired");
                }
            } else if (c == "\\") {
                // processing escape characters
                let next_c = this.source.charAt(j+1);
                if (must_be_escape(next_c)) {
                    curContent += c;
                    curContent += next_c;
                    j++;
                } else {
                    curContent += c;
                }
            } else if (c == "!") {
                // here is the inductive part of this recursive descent parser
                let next_c = this.source.charAt(j+1);
                if (next_c == "[") {
                    let result = this.parse_one_command(j);
                    if (result.ErrorOccurred) {
                        return result;
                    }
                    count += result.readLength;
                    j += result.readLength;
                    //curContent += `![ref|${command.name}]`;
                    curContent += `![ref|${1}]`;
                    /*
                    let command = result.result;
                    if (command.name in global_table) {
                        return ParseError(`duplicated identifier: "${command.name}"`);
                    }
                    global_table[command.name] = command;
                    */
                } else {
                    curContent += c;
                }
            } else {
                curContent += c;
            }
        }

        return ParseError("debug");
    }

    private parse_spaces(i: number): ParseResult {
        let count: number = 0;
        let c: string;
        for (let j = i; ; j++) {
            count++;
            c = this.source.charAt(j);
            if (!is_space(c)) {
                break;
            }
        }
        return new ParseResult("", count, c);
    }

    private parse_word(i: number, separator: string): ParseResult {
        let buffer: string = "";
        let count: number = 0;
        for (let j = i; ; j++) {
            count++;
            let c = this.source.charAt(j);
            if (c == "") {
                break;
            } else if (is_one_of(c, separator)) {
                return new ParseResult(buffer, count, c);
            } else {
                buffer += c;
            }
        }
        return ParseError("reached EOF while parsing command");
    }


    private parse_command_and_args(i: number): ParseResult {
        // we have already read "![", so we should set cursol forward by 2 characters.
        let count: number = 2;
        let j: number = i + 2;

        let result: ParseResult = this.parse_spaces(j);
        if (result.lastChar == "]") {
            return ParseError("empty command is not allowed");
        } else if (result.lastChar == "") {
            return ParseError("reached EOF while parsing");
        }

        // we removed spaces before command successfully.
        // note that result.readLength indicates the length of spaces + 1
        // because of prefetching.
        // so we should set (result.readLength - 1) to cursol
        // in order not to remove the first character of the command.
        count += result.readLength - 1;
        j += result.readLength - 1;

        const command_separator = " \t\n|]";
        const command_end = "|]";
        let args: string[] = [];
        while (result.lastChar != "") {
            result = this.parse_word(j, command_separator);
            if (result.ErrorOccurred) {
                return result;
            }
            count += result.readLength;
            j += result.readLength;
            args.push(result.result);
            if (is_one_of(result.lastChar, command_end)) {
                //console.log("break point 1");
                break;
            } else {
                // note that result.readLength indicates the length of an argument + 1
                // because of prefetching.
                // we should decrement cursol before pasing next spaces;
                count--;
                j--;
                result = this.parse_spaces(j);
                if (is_one_of(result.lastChar, command_end)) {
                    count += result.readLength;
                    //console.log("break point 2");
                    break;
                }
                count += result.readLength - 1;
                j += result.readLength - 1;
            }
        }

        return new ParseResult(args, count, result.lastChar);
    }

    private parse_name(i: number): ParseResult {
        let count: number = 0;
        let j: number = i;

        const name_separator = " \t\n]";
        const command_end = "]";

        let result = this.parse_spaces(j);
        count += result.readLength;
        if (is_one_of(result.lastChar, command_end)) {
            return new ParseResult("", count, result.lastChar);
        }
        j += result.readLength;

        // note that result.readLength indicates the length of spaces + 1
        // because of prefetching.
        // we should decrement cursol
        count--;
        j--;

        result = this.parse_word(j, name_separator);
        if (result.ErrorOccurred) {
            return result;
        }

        let name = result.result;
        count += result.readLength;
        j += result.readLength;

        if (is_one_of(result.lastChar, command_end)) {
            return new ParseResult(name, count, result.lastChar);
        }

        count--;
        j--;
        result = this.parse_spaces(j);
        if (is_one_of(result.lastChar, command_end)) {
            count += result.readLength;
            return new ParseResult(name, count, result.lastChar);
        }

        return ParseError("command is not allowed to have the second name, should be end with ']'");
    }

/*
    private parse_detail_and_meta() {

    }

    private parse_detail() {

    }

    private parse_meta() {

    }

    private parse_reference() {
        // parse_one_commandを多用
    }
*/
    private parse_one_command(i: number): ParseResult {
        let command_and_args: string[];
        let command: string;
        let args: string[];
        let name: string;
        let detail: { [key: string]: any; };
        let meta: { [key: string]: any; };
        let reference: { [key: string]: PemdCommand; };
        let content: string;

        let count: number = 0;
        let j: number = i;

        let result = this.parse_command_and_args(j);
        if (result.ErrorOccurred) {
            return result;
        }

        command_and_args = result.result;
        command = command_and_args[0];
        command_and_args.shift()
        args = command_and_args;
        count += result.readLength;
        j += result.readLength;

        //console.log(command, args);

        if (result.lastChar == "") {
            return ParseError("reached EOF while parsing");
        } else if (result.lastChar == "|") {
            result = this.parse_name(j);
            if (result.ErrorOccurred) {
                return result;
            }

            name = result.result;
            count += result.readLength;
            j += result.readLength;
        }

        //console.log(command, args, name);

        if (result.lastChar != "]") {
            return ParseError("expected ']'");
        }

        if (this.source.charAt(j) == "(") {
            console.log("here!!!!!!!");
            result = this.parse_content(j, true);
            if (result.ErrorOccurred) {
                return result;
            }
            content = result.result;
            count += result.readLength;
            j += result.readLength;
        }

        console.log(command, args, name, content);

        let ret = new PemdCommand(command, args, name, detail, meta, reference, content);
        return new ParseResult(ret, count, result.lastChar);
        /*
        result = this.parse_detail();
        if (result.error != null) {
            return result.error;
        }
        detail = result.result;
        count += result.readLength;

        result = this.parse_meta();
        if (result.error != null) {
            return result.error;
        }
        meta = result.result;
        count += result.readLength;

        result = this.parse_reference();
        if (result.error != null) {
            return result.error;
        }
        reference = result.result;
        count += result.readLength;

    */
    }
}


