export interface BaseItem {
  id: string;
  [key: string]: any;
}

export interface FindQuery {
  id: string;
}

export interface UseFindManyState<T extends BaseItem> {
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

export interface FindManyQuery {
  where?: {
    [key: string]: any;
  };
  orderBy?: string;
  page?: number;
  pageSize?: number;
  total?: number;
  populate?: string[];
}

export interface FindManyResponse<T> {
  results: T[];
  page: number;
  pageSize: number;
  orderBy: string;
  total: number;
}

export interface UseFindOptions {
  polling?: number;
  pagination?: boolean;
  skip?: boolean;
}

export interface UseFindManyOptions {
  polling?: number;
  skip?: boolean;
  pagination?: boolean;
}

export interface Options {
  sync: boolean;
}

export type UpdateType = 'UPDATE' | 'CREATE' | 'REMOVE';

export interface ObserverMessage<I extends BaseItem> {
  type: UpdateType;
  item: I;
}

export type Observer<I extends BaseItem> = (msg: ObserverMessage<I>) => void;
