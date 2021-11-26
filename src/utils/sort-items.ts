import { isDate, isString, isNumber, isBoolean, isArray } from 'lodash';
import { parseISO, compareAsc, compareDesc } from 'date-fns';

import { BaseItem } from '../hooks/types';

// https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
const isISOString = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

function getType(value: any): string {
  if (isArray(value)) return 'array';
  if (isNumber(value)) return 'number';
  if (isDate(value)) return 'date';
  if (isBoolean(value)) return 'boolean';
  if (isString(value)) {
    if (isISOString.test(value)) return 'date';
    return 'string';
  }
  return 'string';
}

export function sortItems<T extends BaseItem>(items: T[], orderBy: string = '-lastUpdated'): T[] {
  const key = orderBy.replace('-', '');
  const order: 'ASC' | 'DESC' = orderBy.charAt(0) === '-' ? 'DESC' : 'ASC';

  if (!items || !items.length) return items;

  // TODO this we fail for conditional types
  const itemValue = items[0][key];

  const type = getType(itemValue);

  return items.sort((a: T, b: T) => {
    // console.log(type, order);
    // boolean
    if (type === 'boolean') {
      if (order === 'ASC') {
        return a[key] ? 1 : -1;
        // return a === b ? 0 : a ? -1 : 1;
      }
      return a[key] ? -1 : 1;
      // return a === b ? 0 : a ? 1 : -1;
    }
    // string
    if (type === 'string') {
      const valueA = a[key]?.toUpperCase();
      const valueB = b[key]?.toUpperCase();
      if (order === 'ASC') {
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
      }
      if (valueA > valueB) return -1;
      if (valueA < valueB) return 1;
      return 0;
    }
    // number
    if (type === 'number') {
      if (order === 'ASC') return a[key] - b[key];
      return b[key] - a[key];
    }
    // date
    if (type === 'date') {
      if (order === 'ASC') {
        // @ts-ignore
        return compareAsc(parseISO(a[key]), parseISO(b[key]));
      }
      // @ts-ignore
      return compareDesc(parseISO(a[key]), parseISO(b[key]));
    }
    return 0;
  });
}
