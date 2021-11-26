import { useEffect, useState, useCallback } from 'react';
import { isEqual, orderBy } from 'lodash';
import { findMany } from '../documents';
import { matchQuery } from '../utils/match-query';
import { sortItems } from '../utils/sort-items';

import { observable } from './observer';
import { FindManyQuery, FindManyResponse, UseFindManyOptions, BaseItem, ObserverMessage } from './types';

interface State<T extends BaseItem> {
  loading: boolean;
  error?: {
    [key: string]: string;
  };
  items: T[];
  total: number;
  hasMore: boolean;
  fetchMore(): void;
  refetch(): void;
}

export function useFindMany<T extends BaseItem>(
  datatype: string,
  queryIn: FindManyQuery,
  optsIn: UseFindManyOptions = {},
): State<T> {
  // set default query
  const query = {
    orderBy: '-lastUpdated',
    ...queryIn,
  };
  // set default opts
  const opts = {
    pagination: false,
    ...optsIn,
  };

  const [lastQuery, setLastQuery] = useState<FindManyQuery>();

  const [{ page, pageSkip }, setPage] = useState<{ page: number; pageSkip: boolean }>({
    page: query.page ? query.page : 1,
    pageSkip: false,
  });
  const [state, setState] = useState<Omit<Omit<State<T>, 'fetchMore'>, 'refetch'>>({
    loading: true,
    items: [],
    hasMore: false,
    total: 0,
  });

  const listener = useCallback(
    ({ type, item }: ObserverMessage<T>) => {
      // handle datatype update
      if (type === 'UPDATE') {
        setState(state => ({
          ...state,
          items: state.items.slice().map(it => {
            if (item.id === it.id) return item;
            return it;
          }),
        }));
      }
      // handle datatype remove
      if (type === 'REMOVE') {
        setState(state => ({
          ...state,
          items: state.items.slice().filter(it => {
            if (item.id === it.id) return false;
            return true;
          }),
        }));
      }

      // handle datatype create
      if (type === 'CREATE' && lastQuery) {
        if (lastQuery.where) {
          if (matchQuery<T>(lastQuery, item)) {
            setState(state => ({
              ...state,
              items: sortItems([...state.items, item], lastQuery.orderBy),
            }));
          }
        } else {
          setState(state => ({
            ...state,
            items: sortItems([...state.items, item], lastQuery.orderBy),
          }));
        }
      }
    },
    [lastQuery],
  );

  useEffect(() => {
    observable.addObserver<T>(datatype, listener);
    return () => {
      observable.removeObserver<T>(datatype, listener);
    };
  }, [state, datatype, listener]);

  const fetchQuery = useCallback(
    async ({ datatype, query, addToItems }: { datatype: string; query: FindManyQuery; addToItems: boolean }) => {
      findMany(datatype, query)
        .then((res: FindManyResponse<T>) => {
          const hasMore = res.page * res.pageSize < res.total;

          if (!addToItems) {
            setState({
              items: sortItems(res.results, query?.orderBy || 'id'),
              // items: res.results,
              total: res.total,
              loading: false,
              hasMore,
            });
          } else {
            setState({
              items: sortItems(
                res.results.reduce(
                  (acc: T[], doc) => {
                    // check if doc already exists in array
                    const currentIndex = acc.findIndex(item => item.id === doc.id);
                    if (currentIndex === -1) {
                      // console.log([...acc, doc]);
                      return [...acc, doc];
                    } else {
                      // const col = [...acc];
                      // col.splice(currentIndex, 1, doc);
                      // return col;
                      return acc;
                    }
                  },
                  [...state.items],
                ),
                query?.orderBy || 'id',
              ),
              total: res.total,
              loading: false,
              hasMore,
            });
          }
        })
        .catch(err => {
          console.error(err);
          setState({
            ...state,
            loading: false,
            error: err,
          });
        });
    },
    [state, lastQuery],
  );

  // external query update
  useEffect(() => {
    // handle internal page increase (fetchMore) and query.page change
    const updatedQuery = {
      ...query,
      ...opts,
      datatype
    };

    // @ts-ignore
    if (isEqual(lastQuery, updatedQuery)) return;
    setPage({ page: query.page || 1, pageSkip: true });
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
      query: updatedQuery,
      addToItems: false,
    });
    // eslint-disable-next-line
  }, [datatype, Object.values(query.where ? query.where : []), query.page, opts]);

  // internal page update
  useEffect(() => {
    // don't use internal page state for pagination
    if (opts.pagination) return;
    if (pageSkip) return;

    const updatedQuery = {
      ...query,
      page,
      ...opts,
    };

    // if (isEqual(lastQuery, updatedQuery)) return;

    fetchQuery({
      datatype,
      query: updatedQuery,
      addToItems: true,
    });
  }, [page]);

  // polling
  useEffect(() => {
    if (!opts.polling) return;
    if (!opts.pagination) {
      console.error('Polling is only supported for pagination');
      return;
    }

    const interval = setInterval(() => {
      fetchQuery({ datatype, query, addToItems: false });
    }, opts.polling * 1000);

    return () => clearInterval(interval);
  }, [opts, query, datatype, fetchQuery]);

  return {
    ...state,
    refetch: () => {
      if (!opts.pagination) {
        console.error('refetch is only supported for pagination');
        return;
      }
      fetchQuery({ datatype, query: { ...lastQuery }, addToItems: false });
    },
    fetchMore: () => {
      if (opts.pagination) {
        console.error('fetchMore is not supported for pagination');
        return;
      }
      setPage({ page: page + 1, pageSkip: false });
    },
  };
}
