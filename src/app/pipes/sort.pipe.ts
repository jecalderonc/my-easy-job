import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'sort'
})
export class SortPipe implements PipeTransform {

    /**
     * Transfor method that sort the array.
     *
     * @param value Array.
     * @param args Sort parameters.
     */
    transform(value: Array<any>, args: any[]): any {
        const sortField = args[0];
        if (sortField !== '') {
            const sortDirection = args[1];
            let multiplier = 1;
            if (sortDirection === 'desc') {
                multiplier = -1;
            }
            value.sort((a: any, b: any) => {
                if (a[sortField] < b[sortField]) {
                    return -1 * multiplier;
                } else if (a[sortField] > b[sortField]) {
                    return 1 * multiplier;
                } else {
                    return 0;
                }
            });
        }
        return value;
    }

}
