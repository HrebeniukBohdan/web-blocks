import { Filter } from '../../../web-blocks/core';
import { IFilter } from '../../../web-blocks/core/types';
import { TodoTaskData } from '../types';

@Filter({ filterName:'taskSort' })
export class TaskSortFilter implements IFilter {
  transform(tasks: TodoTaskData[]): TodoTaskData[] {
    const array = [...tasks].sort((aTask, bTask) => {
      if (!aTask.done && bTask.done) return -1;
      if (aTask.done && !bTask.done) return 1;
      return 0;
    });

    return array;
  }
}