import { Lexer } from "./Lexer";
import { Parser } from "./Parser";


/*const source = `
    <!-- This is my new component -->
        a new text yo yo yo yo
    <%wb-if myAtr={{24}} %>
        <%wb-for iterable={{$objects}} %>
            <%wb-yo myAtr={{$yo}} %>
                <div myAtr={{$yo}} @click={{$someHandler($event, 100, true)}} @mouseUp={{$handler2(false)}}>
                    yoyoyoyyo
                    <div attr={{$currentObj}} bool={{true}}>yoyoyoyyo {{$yo}}</div>
                </div>
            <%/wb-yo %>
        <%/wb-for %>
    <%/wb-if %>
    <my-new-comp someAttr = "someValue" aaa={{'aaa'}} num={{10}} funcProp={{$myFunc(10, 'strParam1', $yo)}}/>
    <%wb-yo myAtr={{174}} %>
        <div attr={{$newVar}}>yoyoyoyyo</div>
    <%/wb-yo %>
    <yo someAttr = "someValue" aaa='aaa' />
    <container name = "My name" prop1 ="My name" prop2={{$mySpecialParam}}>
        <!-- Yo commnet -->
        <container name = "My name" prop1 ="My name" prop2="prop">
            <!-- Yo commnet 1 -->
            <my-new-comp someAttr1 = "someValue" aaa='aaa' />
            <comp someAttr2 = "someValue" aaa='aaa' />
            <comp-my someAttr3 = "someValue" aaa='aaa' />
        </container>
    </container>
        hfghgfhghghghfhfhh hgfhgfh yoyoyo yoyoyyoy yyoyoyoy
        tytytryt
    <!-- This is my new component -->
`;
*/

const source = `
    <!-- This is my new component -->
        a new text yo yo yo yo
    <%wb-if myAtr={{24}} %>
    <%wb-for iterable={{$objects}} %>
        <%wb-yo myAtr={{$yo}} %>
            <div myAtr={{$yo}} @click={{$someHandler($event, 100, true)}} @mouseUp={{$handler2(false)}}>
                yoyoyoyyo
                <div attr={{$currentObj}} bool={{true}}>yoyoyoyyo {{$yo}}</div>
            </div>
        <%/wb-yo %>
    <%/wb-for %>
    <%/wb-if %>
    <my-new-comp someAttr = "someValue" aaa={{'aaa'}} num={{10}} funcProp={{$myFunc(10, 'strParam1', $yo)}}/>
    <%wb-yo myAtr={{174}} %>
        <div attr={{$newVar}}>yoyoyoyyo</div>
    <%/wb-yo %>
    <yo someAttr = "someValue" aaa='aaa' />
    <container name = "My name" prop1 ="My name" prop2={{$mySpecialParam}}>
    <!-- Yo commnet -->
    <container name = "My name" prop1 ="My name" prop2="prop">
        <!-- Yo commnet 1 -->
        <my-new-comp someAttr1 = "someValue" aaa='aaa' />
        <comp someAttr2 = "someValue" aaa='aaa' />
        <comp-my someAttr3 = "someValue" aaa='aaa' />
    </container>
    </container>
        hfghgfhghghghfhfhh hgfhgfh yoyoyo yoyoyyoy yyoyoyoy
        tytytryt
    <!-- This is my new component -->
`;

const lexer = new Lexer(source);
console.log(lexer.tokenize());



const parser = new Parser(source)

const ast = parser.parse();
console.log(ast);
console.log(ast.exec());