import { registerDependency } from './../di/di';
import { ConstructorClass } from './../core/types';
import { wbModule } from '../core/module';
import { patchForwardRefs } from '../core/decorator';
import 'reflect-metadata';

export function Modificator<TClass extends ConstructorClass>(
        params: { selector: string }
    ): (target: TClass) => TClass {
    return function (target: TClass): TClass {
        const t: any = target;
        if (!(t.prototype.modify && typeof t.prototype.modify === 'function')) { 
            throw new Error(`Modificator class "${t.prototype.name}" must implement IModificator interface.`);
        }
        const modificatorName = `wb-${params.selector}`;
        t.ωß_INJECT = Reflect.getMetadata('design:paramtypes', target) || [];
        patchForwardRefs(t);
        registerDependency(t, true);
        wbModule.registerModificator(modificatorName, t);
        return <TClass>target;
    };
}