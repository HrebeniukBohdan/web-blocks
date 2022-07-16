import { patchForwardRefs } from "./../Component";
import { registerDependency } from "../di/di";
import { createScope, flattenArray, getScopeProp, renderModificator } from "./../modificator";
import { wbModule } from "./module";
import { ConstructorClass } from "./types";
import { compileTemplate } from "./compile";
import { renderWebBlock } from "./render";

const h = renderWebBlock;
const m = renderModificator;
const a = flattenArray;
const s = createScope;
const g = getScopeProp;

export function WebBlockTemplate<TClass extends ConstructorClass>(params: {
    selector: string
    template: string
}): (target: TClass) => TClass {
    return function (target: TClass): TClass {
        const componentName = `wb-${params.selector}`;
        const renderTemplate = compileTemplate(params.template);
        const t: any = target;
        t.ωß_INJECT = Reflect.getMetadata('design:paramtypes', target) || [];
        t.ωß_COMPONENT_NAME = componentName;
        t.ωß_Template = (ctx: unknown) => renderTemplate(h, m, s, g, a, ctx);
        patchForwardRefs(t);
        registerDependency(t, false);
        wbModule.registerComponent(componentName, t);
        return <TClass>target;
    };
}