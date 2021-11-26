import nodeFetch from 'cross-fetch';

import { getToken } from '../state';
import buildURL from './build-url';
import isJson from './is-json';
import safelyParseJSON from './safety-parse-json';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const fetch = typeof window === 'undefined' ? nodeFetch : window.fetch;

export default async function request({
  url,
  data = {},
  params = {},
  method = 'GET',
}: {
  url: string;
  data?: any;
  params?: any;
  method: Method;
}) {
  const config: any = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  };

  if (method !== 'GET') {
    config.body = JSON.stringify(data, (_, v) => (v === undefined ? null : v));
  }

  const res = await fetch(buildURL(url, params), config);

  if (res.status === 401) throw Error('Unauthorized');
  if (res.status === 404) throw Error('Not found');

  const text = await res.text();
  const resIsJson = isJson(text);

  if (res.status === 400) {
    const error = new Error(resIsJson ? 'Validation errors' : text);
    // @ts-ignore
    if (resIsJson) error.data = safelyParseJSON(text);
    throw error;
  }

  if (isJson(text)) {
    return safelyParseJSON(text);
  } else {
    return text;
  }
}
