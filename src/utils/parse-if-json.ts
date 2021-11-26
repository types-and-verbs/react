import isJson from './is-json';
import safelyParseJSON from './safety-parse-json';

export default async function parseIfJson(res: any): Promise<any> {
  const text = await res.text();

  if (isJson(text)) {
    return safelyParseJSON(text);
  } else {
    return text;
  }
}
