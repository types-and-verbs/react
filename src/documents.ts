import { apiURL } from './utils/apiURL';
import request from './utils/request';

interface Query {
  where?: object;
  orderBy?: string;
  page?: number;
  pageSize?: number;
  populate?: string[];
}

interface Item {
  id: string;
}

export function findMany(endpoint: string, query: Query) {
  // if (!user) throw Error('signin before making requests');
  const url = `${apiURL()}/${endpoint}`;
  return request({ url, params: query, method: 'GET' });
}

export function findOne(endpoint: string, id: string) {
  // if (!user) throw Error('signin before making requests');
  const url = `${apiURL()}/${endpoint}/${id}`;
  return request({ url, method: 'GET' });
}

export function create<T>(endpoint: string, data: T) {
  // if (!user) throw Error('signin before making requests');
  const url = `${apiURL()}/${endpoint}`;
  return request({ url, data, method: 'POST' });
}

export function update<T extends Item>(endpoint: string, id: string, data: T) {
  // if (!user) throw Error('signin before making requests');
  if (!id) throw Error('Id is required');
  const url = `${apiURL()}/${endpoint}/${id}`;
  return request({ url, data, method: 'PATCH' });
}

export function remove(endpoint: string, id: string) {
  // if (!user) throw Error('signin before making requests');
  const url = `${apiURL()}/${endpoint}/${id}`;
  return request({ url, method: 'DELETE' });
}
