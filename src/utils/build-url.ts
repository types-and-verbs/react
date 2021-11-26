// @ts-nocheck

function encode(val) {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
}

function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (let i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

function isArray(val) {
  return toString.call(val) === '[object Array]';
}

function isDate(val) {
  return toString.call(val) === '[object Date]';
}

function isObject(val) {
  return val !== null && typeof val === 'object';
}

export default function buildURL(url, params) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  let serializedParams;
  const parts = [];

  forEach(params, function serialize(val, key) {
    if (val === null || typeof val === 'undefined') {
      return;
    }

    if (isArray(val)) {
      key = key + '[]';
    } else {
      val = [val];
    }

    forEach(val, function parseValue(v) {
      if (isDate(v)) {
        v = v.toISOString();
      } else if (isObject(v)) {
        v = JSON.stringify(v);
      }
      parts.push(encode(key) + '=' + encode(v));
    });
  });

  serializedParams = parts.join('&');

  if (serializedParams) {
    const hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}
