import { BooleanNode } from "./ast/nodes/boolean";
import { CommentNode } from "./ast/nodes/comment";
import { ElementNode } from "./ast/nodes/element";
import { EvBindAttribute } from "./ast/nodes/event-bind-attribute";
import { EventVariableNode } from "./ast/nodes/event-variable";
import { FilterNode } from "./ast/nodes/filter";
import { FunctionNode } from "./ast/nodes/function";
import { InterpolationAttribute } from "./ast/nodes/interpolation-attribute";
import { ModificatorNode } from "./ast/nodes/modificator";
import { NumberNode } from "./ast/nodes/number";
import { RootNode } from "./ast/nodes/root";
import { StringNode } from "./ast/nodes/string";
import { TextNode } from "./ast/nodes/text";
import { TextAttribute } from "./ast/nodes/text-attribute";
import { VariableNode } from "./ast/nodes/variable";
import { Element, ExpressionNode, Node, NodeContainer, NodeContainerWithAttributes, ScopedElement } from "./ast/types";
import { Lexer } from "./Lexer";
import { Token } from "./Token";
import { TokenTypeName } from "./TokenType";

let scopeIndex = 0;
export function initScopeIndex(): number {
    scopeIndex = 0;
    return useScopeIndex();
}
export function useScopeIndex(): number {
    return scopeIndex++;
}

export class Parser {
    private lexer: Lexer;
    private currentTokenIndex = 0;
    private eventBindCount = 0;
    private root: RootNode;

    constructor(private source: string) {
        this.lexer = new Lexer(source);
        this.lexer.tokenize();
        this.root = new RootNode();
    }

    private get currentToken(): Token {
        return this.lexer.tokens[this.currentTokenIndex];
    }

    private get currentTokenType(): TokenTypeName {
        return this.currentToken.type.name;
    }

    private nextToken(): boolean {
        this.currentTokenIndex++;
        return this.isEOF;
    }

    private get isEOF(): boolean {
        return this.currentTokenIndex >= this.lexer.tokens.length;
    }

    private consumeToken(typeName: TokenTypeName): Token|never {
        const token = this.currentToken;
        if (token.type.name !== typeName) {
            throw Error(`Expected "${typeName}" token but got "${token.type.name}"`);
        }
        this.nextToken();
        return token;
    }

    parse(): Node {
        this.RootNode(this.root);

        return this.root;
    }

    private throwContentListError(): void {
        throw new Error(
            `Syntax error is found at position: token type "${this.currentToken.type.name}" is not expected to find while content list parsing
            ${this.source.slice(0, this.currentToken.position) + ' !== See here (Unexpected token) ==> ' + this.source.slice(this.currentToken.position)}
            `);
    }

    /**************** Root node parsing  *****************/
    private RootNode(parentNode: RootNode): void {
        while (!this.isEOF) {
            if (this.isComment()) {
                this.Comment(parentNode);
            } else 
            if (this.isText()) {
                this.Text(parentNode);
            } else 
            if (this.isElement()) {
                this.Element(parentNode, parentNode);
            } else 
            if (this.isModificator()) {
                this.Modificator(parentNode, parentNode);
            } else 
            if (this.isInterpolation()) {
                parentNode.addNode(this.InterpolationExpression(parentNode));
            } else {
                this.throwContentListError();
            }
        }
    }
    /********* Modificator parsing block **********/
    private isModificator(): boolean {
        return this.currentTokenType === 'OPEN_MODIFICATOR_TAG';
    }
    private isModificatorEnd(): boolean {
        return this.currentTokenType === 'CLOSE_MODIFICATOR_TAG';
    }
    private Modificator(parentNode: NodeContainer, scope: ScopedElement): void {
        const node: ModificatorNode = new ModificatorNode(
            this.consumeToken('OPEN_MODIFICATOR_TAG').value,
            parentNode.nestingLevel + 1,
            scope
        );

        if (this.isAttribute()) {
            this.AttributeList(node, scope);
        }

        this.consumeToken('OPEN_MODIFICATOR_TAG_CLOSE_SIGN');

        if (!this.isContent()) {
            throw new Error(
                `Modificator must have content: either text, comment, element or another modicifator.`
            );
        }

        this.ContentList(node, node, true);

        const closeTagName = this.consumeToken('CLOSE_MODIFICATOR_TAG').value;
        if (node.name !== closeTagName) {
            throw new Error(
                `Open and close tag name doesn't match! "${node.name}" !== "${closeTagName}"`
            );
        }

        parentNode.addNode(node);
    }
    
    /********* Element parsing block **********/
    private isOpenTagSelfClosed(): boolean {
        return this.currentTokenType === 'SELF_CLOSE_TAG_SIGN';
    }
    private isOpenTagClosed(): boolean {
        return this.currentTokenType === 'OPEN_TAG_CLOSE_SIGN';
    }
    private isElementEnd(): boolean {
        return this.currentTokenType === 'CLOSE_TAG';
    }
    private isElement(): boolean {
        return this.currentTokenType === 'OPEN_TAG';
    }
    private isContent(): boolean {
        return this.isText()||this.isComment()||this.isElement()||this.isModificator();
    }
    private ContentList(parentNode: NodeContainer, scope: ScopedElement, modificator = false): void {
        const isEnd = modificator ? this.isModificatorEnd.bind(this) : this.isElementEnd.bind(this);
        
        while (!isEnd()) {
            if (this.isComment()) {
                this.Comment(parentNode);
            } else 
            if (this.isText()) {
                this.Text(parentNode);
            } else 
            if (this.isElement()) {
                this.Element(parentNode, scope);
            } else 
            if (this.isModificator()) {
                this.Modificator(parentNode, scope);
            } else 
            if (this.isInterpolation()) {
                parentNode.addNode(this.InterpolationExpression(scope));
            } else {
                this.throwContentListError();
            }
        }
    }
    private Element(parentNode: NodeContainer, scope: ScopedElement): void {
        const node: Element = new ElementNode(
            this.consumeToken('OPEN_TAG').value,
            parentNode.nestingLevel + 1
        );

        if (this.isAttribute() || this.isEventBind()) {
            this.MixedAttributeList(node, scope);
        }
        if (this.isOpenTagClosed()) {
            this.consumeToken('OPEN_TAG_CLOSE_SIGN');
            this.ContentList(node, scope);
            const closeTagName = this.consumeToken('CLOSE_TAG').value;
            if (node.name !== closeTagName) {
                throw new Error(
                    `Open and close tag name doesn't match! "${node.name}" !== "${closeTagName}"`
                );
            }
            parentNode.addNode(node);
            return;
            // tag end
        } else
        if (this.isOpenTagSelfClosed()) {
            this.consumeToken('SELF_CLOSE_TAG_SIGN');
            parentNode.addNode(node);
            // tag end
        } else {
            throw new Error(
                `Unexpected token: "${this.currentToken.type}";
                    Expected tokens: ["AttributeName = ", ">", "/>"].`
            );
        }
    }

    /********* Text parsing block **********/
    private isText(): boolean {
        return this.currentTokenType === 'TEXT';
    }
    private Text(parentNode: NodeContainer): void {
        const textValue = this.consumeToken('TEXT').value;
        
        parentNode.addNode(new TextNode(textValue));
    }

    /********* Comments parsing block **********/
    private isComment(): boolean {
        return this.currentTokenType === 'COMMENT';
    }
    private Comment(parentNode: NodeContainer): void {
        const commentValue = this.consumeToken('COMMENT').value;
        
        parentNode.addNode(new CommentNode(commentValue.trim()));
    }

    /********* Boolean parsing block **********/
    private isBoolean(): boolean {
        return this.currentTokenType === 'TRUE' || this.currentTokenType === 'FALSE';
    }

    private Boolean(): BooleanNode {
        let booleanNode: BooleanNode;

        if (this.currentTokenType === 'TRUE') {
            this.consumeToken('TRUE');
            booleanNode = new BooleanNode('true');
        } else {
            this.consumeToken('FALSE');
            booleanNode = new BooleanNode('false');
        }

        return booleanNode;
    }

    /********* Interpolation expression parsing block **********/
    private isInterpolation(): boolean {
        return this.currentTokenType === 'INTERPOLATION_START';
    }

    private isInterpolationEnd(): boolean {
        return this.currentTokenType === 'INTERPOLATION_END';
    }

    private isNumber(): boolean {
        return this.currentTokenType === 'NUMBER';
    }

    private isObjectPathIdentifier(): boolean {
        return this.currentTokenType === 'OBJECT_PATH_ID';
    }

    private isIdentifier(): boolean {
        return this.currentTokenType === 'ID';
    }

    private isFilterIdentifier(): boolean {
        return this.currentTokenType === 'FILTER_ID';
    }

    private isEvent(): boolean {
        return this.currentTokenType === 'EVENT';
    }

    private isParenL(): boolean {
        return this.currentTokenType === 'PAREN_L';
    }

    private isParenR(): boolean {
        return this.currentTokenType === 'PAREN_R';
    }

    private isComma(): boolean {
        return this.currentTokenType === 'COMMA';
    }

    private isColon(): boolean {
        return this.currentTokenType === 'COLON';
    }

    private FilterParameterExpression(scope: ScopedElement): Node {
        let node: Node;

        this.consumeToken('COLON');

        if (this.isNumber()) {
            node = new NumberNode(this.consumeToken('NUMBER').value);
        } else
        if (this.isBoolean()) {
            node = this.Boolean();
        } else 
        if (this.isString()) {
            node = new StringNode(this.consumeToken('STRING').value);
        } else 
        if (this.isObjectPathIdentifier()) {
            node = new VariableNode(this.consumeToken('OBJECT_PATH_ID').value, scope);
        } else
        if (this.isIdentifier()) {
            node = new VariableNode(this.consumeToken('ID').value, scope);
        } else {
            throw new Error('Expected to parse either StringLiteral, NumberLiteral or Variable');
        }

        return node;
    }

    private ParameterExpression(scope: ScopedElement): Node {
        let node: Node;

        if (this.isNumber()) {
            node = new NumberNode(this.consumeToken('NUMBER').value);
        } else
        if (this.isBoolean()) {
            node = this.Boolean();
        } else 
        if (this.isString()) {
            node = new StringNode(this.consumeToken('STRING').value);
        } else 
        if (this.isObjectPathIdentifier()) {
            node = new VariableNode(this.consumeToken('OBJECT_PATH_ID').value, scope);
        } else
        if (this.isIdentifier()) {
            node = new VariableNode(this.consumeToken('ID').value, scope);
        } else {
            throw new Error('Expected to parse either StringLiteral, NumberLiteral or Variable');
        }

        if (this.isComma()) {
            this.consumeToken('COMMA');
        }

        return node;
    }

    private FunctionExpression(functionName: string, scope: ScopedElement): FunctionNode {
        const funcNode = new FunctionNode(functionName);
        this.consumeToken('PAREN_L');

        while (!this.isParenR()) {
            funcNode.addNode(
                this.ParameterExpression(scope)
            );
        }

        this.consumeToken('PAREN_R');

        return funcNode;
    }

    private FilterExpression(filterName: string, idToken: Token, scope: ScopedElement): FilterNode {
        const filterNode = new FilterNode(filterName);

        filterNode.addInputParam(new VariableNode(idToken.value, scope))

        while (this.isColon()) {
            filterNode.addNode(
                this.FilterParameterExpression(scope)
            );
        }

        return filterNode;
    }

    private EventParameterExpression(scope: ScopedElement): Node {
        let node: Node;

        if (this.isNumber()) {
            node = new NumberNode(this.consumeToken('NUMBER').value);
        } else
        if (this.isBoolean()) {
            node = this.Boolean();
        } else 
        if (this.isString()) {
            node = new StringNode(this.consumeToken('STRING').value);
        } else 
        if (this.isObjectPathIdentifier()) {
            node = new VariableNode(this.consumeToken('OBJECT_PATH_ID').value, scope);
        } else
        if (this.isIdentifier()) {
            node = new VariableNode(this.consumeToken('ID').value, scope);
        } else 
        if (this.isEvent()) {
            node = new EventVariableNode(this.consumeToken('EVENT').value);
        } else {
            throw new Error('Expected to parse either StringLiteral, NumberLiteral or Variable');
        }

        if (this.isComma()) {
            this.consumeToken('COMMA');
        }

        return node;
    }

    private EventFunctionExpression(functionName: string, scope: ScopedElement): FunctionNode {
        const funcNode = new FunctionNode(functionName);
        this.consumeToken('PAREN_L');

        while (!this.isParenR()) {
            funcNode.addNode(
                this.EventParameterExpression(scope)
            );
        }

        this.consumeToken('PAREN_R');

        return funcNode;
    }

    private InterpolationExpression(scope: ScopedElement): ExpressionNode {
        let expression: ExpressionNode;
        this.consumeToken('INTERPOLATION_START');

        if (this.isBoolean()) {
            expression = this.Boolean();
            this.consumeToken('INTERPOLATION_END');
            return expression;
        }

        if (this.isString()) {
            expression = new StringNode(this.consumeToken('STRING').value);
            this.consumeToken('INTERPOLATION_END');
            return expression;
        }

        if (this.isNumber()) {
            expression = new NumberNode(this.consumeToken('NUMBER').value);
            this.consumeToken('INTERPOLATION_END');
            return expression;
        } 

        if (this.isObjectPathIdentifier()) {
            expression = new VariableNode(this.consumeToken('OBJECT_PATH_ID').value, scope);
            this.consumeToken('INTERPOLATION_END');
            return expression;
        }

        const idName = this.consumeToken('ID');

        if (this.isFilterIdentifier()) {
            const filterId = this.consumeToken('FILTER_ID');
            expression = this.FilterExpression(filterId.value, idName, scope);
        } else 
        if (this.isParenL()) {
            expression = this.FunctionExpression(idName.value, scope);
        } else 
        if (this.isInterpolationEnd()) {
            expression = new VariableNode(idName.value, scope);
        } else {
            throw new Error(`Expected to parse either variable or fucntion call.`);
        }

        this.consumeToken('INTERPOLATION_END');

        return expression;
    }

    /********* EventBind parsing block **********/
    private isEventBind(): boolean {
        return this.currentTokenType === 'EVENT_BIND';
    }
    private EventBind(node: Element, scope: ScopedElement): void {
        const eventName = this.consumeToken('EVENT_BIND').value;

        if (this.isInterpolation()) {
            this.consumeToken('INTERPOLATION_START');
            const idName = this.consumeToken('ID');
            const eventBind = new EvBindAttribute(eventName, this.eventBindCount, this.EventFunctionExpression(idName.value, scope));
            this.eventBindCount++;

            node.addEventBind(eventBind);
            this.root.addEventBind(eventBind);

            this.consumeToken('INTERPOLATION_END');
        } else {
            throw new Error(
                `Unexpected token: "${this.currentToken.type}";
                    Expected tokens: [{{ functionCallExpression }}].`
            );
        }
    }
    private MixedAttributeList(node: Element, scope: ScopedElement): void {
        while (this.isAttribute() || this.isEventBind()) {
            if (this.isAttribute()) {
                this.Attribute(node, scope);
            } else {
                this.EventBind(node, scope);
            }
        }
    }

    /********* Attribute parsing block **********/
    private isString(): boolean {
        return this.currentTokenType === 'STRING';
    }
    private isAttribute(): boolean {
        return this.currentTokenType === 'ATTRIBUTE';
    }
    private Attribute(node: NodeContainerWithAttributes, scope: ScopedElement): void {
        const attrName = this.consumeToken('ATTRIBUTE').value;

        if (this.isString()) {
            const attrTextValue = this.consumeToken('STRING').value;
            node.addAttribute(new TextAttribute(attrName, attrTextValue));
        } else 
        if (this.isInterpolation()) {
            node.addAttribute(
                new InterpolationAttribute(attrName, this.InterpolationExpression(scope))
            );
        } else {
            throw new Error(
                `Unexpected token: "${this.currentToken.type}";
                    Expected tokens: ["doubleQuotedStringValue", 'singleQuotedStringValue', {{ interpolationExpression }}].`
            );
        }
    }
    private AttributeList(node: NodeContainerWithAttributes, scope: ScopedElement): void {
        while (this.isAttribute()) {
            this.Attribute(node, scope);
        }
    }
}