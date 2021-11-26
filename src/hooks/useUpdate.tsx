import { update as Update } from '../documents';

import { observable } from './observer';
import { BaseItem, Options } from './types';
import { optionsDefault } from './constants';

interface Payload<T> {
  update(id: string, data: Partial<T>): Promise<T>;
}

export function useUpdate<T extends BaseItem>(datatype: string, options?: Options): Payload<T> {
  const opts = {
    ...optionsDefault,
    options,
  };

  async function update(id: string, data: T): Promise<T> {
    const item = await Update<T>(datatype, id, data);

    if (opts.sync) {
      observable.notifyObservers<T>(datatype, {
        type: 'UPDATE',
        item,
      });
    }

    return item;
  }

  return { update };
}
