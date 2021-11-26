import nodeFetch from 'cross-fetch';

import isJson from './is-json';
import safelyParseJSON from './safety-parse-json';

const fetch = typeof window === 'undefined' ? nodeFetch : window.fetch;

export async function post(url: string, data: object) {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const text = await res.text();
  const resIsJson = isJson(text);

  if (res.status === 400) {
    const error = new Error(resIsJson ? 'Errors' : text);
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
