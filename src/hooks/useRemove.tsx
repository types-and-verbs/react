import { remove as Remove } from '../documents';

import { observable } from './observer';
import { BaseItem, Options } from './types';
import { optionsDefault } from './constants';

interface Payload<T> {
  remove(id: string): Promise<T | null>;
}

export function useRemove<T extends BaseItem>(datatype: string, options?: Options): Payload<T | null> {
  const opts = {
    ...optionsDefault,
    options,
  };

  return {
    remove: async function remove(id: string): Promise<T | null> {
      if (!id) {
        console.warn('id is required to remove item');
        return null;
      }

      const item = await Remove(datatype, id);

      if (opts.sync) {
        observable.notifyObservers<T>(datatype, {
          type: 'REMOVE',
          item,
        });
      }

      return item;
    },
  };
}
