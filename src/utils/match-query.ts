import { isNil, isDate, isString, isNumber, isArray } from 'lodash';
import { isBefore, isAfter, parseISO } from 'date-fns';
import { FindManyQuery } from '../hooks/types';

const allHelpers = [
  '_contains',
  '_starts_with',
  '_ends_with',
  '_includes',
  '_excludes',
  '_before',
  '_after',
  '_between',
  '_lte',
  '_lt',
  '_gte',
  '_gt',
];

function removeKeyHelper(key: string): string {
  return allHelpers.reduce((acc, val) => {
    return acc.replace(val, '');
  }, key);
}

function doesKeyContainHelper(key: string, helpers: string[] = allHelpers): boolean {
  return helpers.reduce((acc: boolean, val: string) => {
    if (key.endsWith(val)) return true;
    return acc;
  }, false);
}

function forceDate(i: Date | string): Date {
  // @ts-ignore
  if (isDate(i)) return i;
  // @ts-ignore
  return parseISO(i);
}

export function matchQuery<T>(lastQuery: FindManyQuery, item: T): boolean {
  if (!lastQuery.where) return false;

  // console.log(JSON.stringify(lastQuery));
  // console.log(JSON.stringify(item));

  // does it match the last query .where
  const matchLastQuery = Object.keys(lastQuery.where).reduce((acc: boolean, keyWithHelper: string) => {
    const key = removeKeyHelper(keyWithHelper);
    // console.log(key, keyWithHelper, lastQuery.where);
    if (!lastQuery.where) return acc;

    // mimick api string helpers
    // @ts-ignore
    if (isString(item[key]) && doesKeyContainHelper(keyWithHelper, ['_contains', '_starts_with', '_ends_with'])) {
      if (keyWithHelper.endsWith('_contains')) {
        // @ts-ignore
        return item[key].includes(lastQuery.where[keyWithHelper]);
      }
      if (keyWithHelper.endsWith('_starts_with')) {
        // @ts-ignore
        return item[key].charAt(0) === lastQuery.where[keyWithHelper];
      }
      if (keyWithHelper.endsWith('_ends_with')) {
        const value = lastQuery.where[keyWithHelper];
        // @ts-ignore
        return item[key].substr(-value.length) === lastQuery.where[keyWithHelper];
      }
    }

    // mimick api number helpers
    // @ts-ignore
    if (isNumber(item[key]) && doesKeyContainHelper(keyWithHelper, ['_lt', '_lte', '_gt', '_gte', '_between'])) {
      if (keyWithHelper.endsWith('_lt')) {
        // @ts-ignore
        return item[key] < lastQuery.where[keyWithHelper];
      }
      if (keyWithHelper.endsWith('_lte')) {
        // @ts-ignore
        return item[key] <= lastQuery.where[keyWithHelper];
      }
      if (keyWithHelper.endsWith('_gt')) {
        // @ts-ignore
        return item[key] > lastQuery.where[keyWithHelper];
      }
      if (keyWithHelper.endsWith('_gte')) {
        // @ts-ignore
        return item[key] >= lastQuery.where[keyWithHelper];
      }
      if (keyWithHelper.endsWith('_between')) {
        // @ts-ignore
        return item[key] >= lastQuery.where[keyWithHelper][0] && item[key] <= lastQuery.where[keyWithHelper][1];
      }
    }

    // mimick api array helpers
    // @ts-ignore
    if (isArray(item[key]) && doesKeyContainHelper(keyWithHelper, ['_includes', '_excludes'])) {
      if (keyWithHelper.endsWith('_includes')) {
        // @ts-ignore
        return !!item[key].find(x => x === lastQuery.where[keyWithHelper]);
      }
      if (keyWithHelper.endsWith('_excludes')) {
        // @ts-ignore
        return !item[key].find(x => x === lastQuery.where[keyWithHelper]);
      }
    }

    // mimick api date helpers
    if (
      // TODO if a string was saved then happened to be a valid date
      // @ts-ignore
      parseISO(item[key]) !== 'Invalid Date' &&
      doesKeyContainHelper(keyWithHelper, ['_before', '_after', '_between'])
    ) {
      // @ts-ignore
      const dateToCompare = parseISO(item[key]);
      if (keyWithHelper.endsWith('_before')) {
        return isBefore(dateToCompare, forceDate(lastQuery.where[keyWithHelper]));
      }
      if (keyWithHelper.endsWith('_after')) {
        return isAfter(dateToCompare, forceDate(lastQuery.where[keyWithHelper]));
      }
      if (keyWithHelper.endsWith('_between')) {
        return (
          isAfter(dateToCompare, forceDate(lastQuery.where[keyWithHelper][0])) &&
          isBefore(dateToCompare, forceDate(lastQuery.where[keyWithHelper][1]))
        );
      }
    }

    // treat null and undefined as the same
    // @ts-ignore
    if (isNil(lastQuery.where[keyWithHelper]) && isNil(item[key])) {
      return acc;
    }
    // check if item matches query
    // @ts-ignore
    if (lastQuery.where[keyWithHelper] !== item[key]) {
      return false;
    }
    return acc;
  }, true);

  return matchLastQuery;
}
