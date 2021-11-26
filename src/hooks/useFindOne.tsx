import { useEffect, useState, useCallback } from 'react';
import { isEqual } from 'lodash';
import { findOne } from '../documents';

import { observable } from './observer';
import { FindQuery, UseFindOptions, BaseItem, ObserverMessage } from './types';

interface State<T extends BaseItem> {
  loading: boolean;
  error?: {
    [key: string]: string;
  };
  item?: T;
  refetch(): void;
}

export function useFindOne<T extends BaseItem>(
  datatype: string,
  query: FindQuery,
  opts: UseFindOptions = {},
): State<T> {
  const [lastQuery, setLastQuery] = useState<FindQuery>();
  const [state, setState] = useState<Omit<State<T>, 'refetch'>>({
    loading: true,
    item: undefined,
  });

  // TODO test
  const listener = useCallback(
    ({ type, item }: ObserverMessage<T>) => {
      const isThisItem = state.item?.id === item.id;

      if (type === 'UPDATE' && isThisItem) {
        setState(state => ({
          ...state,
          item,
        }));
      }
    },
    [state],
  );

  // TODO test
  useEffect(() => {
    observable.addObserver<T>(datatype, listener);
    return () => {
      observable.removeObserver<T>(datatype, listener);
    };
  }, [state, datatype, listener]);

  const fetchQuery = useCallback(
    async ({ datatype, query }: { datatype: string; query: FindQuery }) => {
      if (!query.id) {
        console.error('Query must include an id');
        return;
      }
      await findOne(datatype, query.id)
        .then((item: T) => {
          setState({
            loading: false,
            item,
          });
        })
        // TODO test
        .catch(err => {
          console.error(err);
          setState({
            ...state,
            loading: false,
            error: err,
          });
        });
    },
    [state],
  );

  // query
  useEffect(() => {
    const updatedQuery = { ...query, ...opts };
    // @ts-ignore
    if (isEqual(lastQuery, updatedQuery)) return;
    setLastQuery(updatedQuery);
    if (opts.skip) {
      setState({
        ...state,
        loading: false,
      });
      return;
    }
    fetchQuery({
      datatype,
      query,
    });
    // eslint-disable-next-line
  }, [datatype, opts]);

  // TODO test
  useEffect(() => {
    if (!opts.polling) return;
    const interval = setInterval(() => {
      fetchQuery({ datatype, query });
    }, opts.polling * 1000);
    return () => clearInterval(interval);
  }, [opts, query, datatype, fetchQuery]);

  return {
    ...state,
    refetch: () => fetchQuery({ datatype, query }),
  };
}
