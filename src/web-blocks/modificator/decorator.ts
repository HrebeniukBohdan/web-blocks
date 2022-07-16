import { wbModule } from '../core/module';
import { IModificator } from "./types";

export function Modificator<TModificator extends IModificator>(
        params: { selector: string }
    ): (target: TModificator) => TModificator {
    return function (target: TModificator): TModificator {
        wbModule.registerModificator(params.selector, target);
        return <TModificator>target;
    };
}