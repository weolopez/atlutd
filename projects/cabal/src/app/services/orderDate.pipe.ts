import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "sort"
})
export class OrderDatePipe {
  transform(array: Array<any>, args: string): Array<any> {
    if (!array) return [];
    array.sort((a: any, b: any) => {
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}