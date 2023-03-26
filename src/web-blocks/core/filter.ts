import { IFilter } from './types';
import { injectDependency, InjectableType } from './../di/di';
import { wbModule } from "./module";

const filtersMap: { 
  [filterName: string]: (value: any, ...args: any[]) => any 
} = {};

export function useFilter(filterName: string): (value: any, ...args: any[]) => any {
  if (filtersMap[filterName]) {
    return filtersMap[filterName];
  } else {
    const filterType: InjectableType = wbModule.getFilter(filterName) as any;
    const filterInst: IFilter = injectDependency(filterType);
    filtersMap[filterName] = (value: any, ...args: any[]) => filterInst.transform(value, ...args);
    return filtersMap[filterName];
  }
}