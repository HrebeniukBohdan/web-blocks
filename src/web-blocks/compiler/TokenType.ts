export type TokenTypeName = 'COMMENT'|'OPEN_TAG'|'CLOSE_TAG'|'EVENT'|'EVENT_BIND'|'ATTRIBUTE'|'STRING'|'OPEN_MODIFICATOR_TAG'|'CLOSE_MODIFICATOR_TAG'|'OPEN_MODIFICATOR_TAG_CLOSE_SIGN'
                |'SELF_CLOSE_TAG_SIGN'|'OPEN_TAG_CLOSE_SIGN'|'TEXT'|'TRUE'|'FALSE'|'FILTER_ID'|'COLON'|'INTERPOLATION_START'|'INTERPOLATION_END'|'ID'|'PAREN_L'|'PAREN_R'|'COMMA'|'NUMBER';
export class TokenType {
    constructor(public name: TokenTypeName, public regex: string) {}
}


export const tokenTypeList: TokenType[] = [
    // Comment
    // Value = Comment text
    // <!--((?:[^-]|-(?!->))*)-->
    new TokenType('COMMENT', '<!--((?:[^-]|-(?!->))*)-->\\s*'),

    // Open Modificator Tag
    // Value = Modificator Name
    // <%\s*([a-zA-Z][a-zA-Z0-9\-]*)
    new TokenType('OPEN_MODIFICATOR_TAG', '\\s*<%\\s*([a-zA-Z][a-zA-Z0-9\\-]*)'),

    // Close Modificator Tag
    // Value = Modificator Name
    // \s*<\s*%\s*\/\s*([a-zA-Z][a-zA-Z0-9\\-]*)\s*%\s*>\s*
    new TokenType('CLOSE_MODIFICATOR_TAG', '\\s*<\\s*%\\s*\\/\\s*([a-zA-Z][a-zA-Z0-9\\-]*)\\s*%\\s*>\\s*'),

    // Open Tag
    // Value = Tag Name
    // <\s*([a-zA-Z][a-zA-Z0-9\-]*)
    new TokenType('OPEN_TAG', '\\s*<\\s*([a-zA-Z][a-zA-Z0-9\\-]*)'),

    // Close Tag (with children)
    // Value = Tag Name
    // <\/([a-zA-Z][a-zA-Z0-9\-]*)>
    new TokenType('CLOSE_TAG', '\\s*<\\/\\s*([a-zA-Z][a-zA-Z0-9\\-]*)\\s*>\\s*'),

    // Event Bind Definition
    // Value = Event Name
    // \s+@([a-zA-Z][a-zA-Z0-9\\-]+)\s*=\s*
    new TokenType('EVENT_BIND', '\\s+@([a-zA-Z][a-zA-Z0-9\\-]+)\\s*=\\s*'),

    // Attribute Definition
    // Value = Attribute Name
    // \s+([a-zA-Z][a-zA-Z0-9\-]+)\s*=\s*
    new TokenType('ATTRIBUTE', '\\s+([a-zA-Z][a-zA-Z0-9\\-]+)\\s*=\\s*'),

    // Open Modificator Tag Close SIGN
    // Value = None
    // \s*(%>)\s*
    new TokenType('OPEN_MODIFICATOR_TAG_CLOSE_SIGN', '\\s*(%>)\\s*'),

    // Self-close Tag SIGN
    // Value = None
    // \s*(\/>)\s*
    new TokenType('SELF_CLOSE_TAG_SIGN', '\\s*(\\/>)\\s*'),

    // Open Tag Close SIGN
    // Value = None
    // \s*(>)\s*
    new TokenType('OPEN_TAG_CLOSE_SIGN', '\\s*(>)\\s*'),

    new TokenType('COLON', '\\s*:'),
    new TokenType('EVENT', '\\s*\\$\\$event'),
    new TokenType('INTERPOLATION_START', '{{'),
    new TokenType('INTERPOLATION_END', '}}'),
    new TokenType('ID', '\\s*\\$([a-zA-Z][a-zA-Z0-9\\_]*)'),
    new TokenType('TRUE', '\\s*true\\s*'),
    new TokenType('FALSE', '\\s*false\\s*'),
    new TokenType('PAREN_L', '\\s*\\('),
    new TokenType('PAREN_R', '\\s*\\)\\s*'),
    new TokenType('COMMA', '\\s*,\\s*'),
    new TokenType('FILTER_ID', '\\s*\\|\\s*([a-zA-Z][a-zA-Z0-9\\_]*)'),
    new TokenType('ID', '\\s*\\$([a-zA-Z][a-zA-Z0-9\\_]*)'),
    new TokenType('NUMBER', '\\s*([\\d]*\\.[\\d]+)'),
    new TokenType('NUMBER', '\\s*([\\d]+)'),
    // String Literal Double-quoted
    // Value = String Value
    // "([^"]*)"|'([^']*)'
    new TokenType('STRING', '"([^"]*)"'),
    new TokenType('STRING', "'([^']*)'"),

    // Text Node
    // Value = Text
    // [^<{]+
    new TokenType('TEXT', '[^<>{}]+')
];