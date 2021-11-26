import { create as Create } from '../documents';
import { observable } from './observer';
import { BaseItem, Options } from './types';
import { optionsDefault } from './constants';

interface Payload<T> {
  create(data: Partial<T>): Promise<T>;
}

export function useCreate<T extends BaseItem>(datatype: string, options?: Options): Payload<T> {
  const opts = {
    ...optionsDefault,
    options,
  };

  return {
    create: async function create(data: T): Promise<T> {
      const item = await Create<T>(datatype, data);

      if (opts.sync) {
        observable.notifyObservers<T>(datatype, {
          type: 'CREATE',
          item,
        });
      }

      return item;
    },
  };
}
